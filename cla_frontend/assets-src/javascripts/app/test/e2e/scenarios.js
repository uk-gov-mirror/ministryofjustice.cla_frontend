/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
(function(){
  'use strict';

  var protractor = require('protractor'),
      utils = require('./_utils'), // UTILS
      APP_BASE_URL = utils.APP_BASE_URL;

  describe('operatorApp', function() {
    // logs the user in before each test
    beforeEach(utils.setUp);

    describe('Case List', function() {
      it('should get case list', function() {
        browser.get(APP_BASE_URL);
        browser.getLocationAbsUrl().then(function(url) {
          utils.expectUrl(url, APP_BASE_URL);
        });
      });
    });

    describe('Create Case', function() {
      it('should create new case', function() {
        // check that the case number in the URL matches that in the page title

        utils.createCase();

        var newCaseUrl;
        browser.getLocationAbsUrl().then(function(url) {
          // note: angular url, not from driver
          newCaseUrl = url;
        });

        browser.findElement(by.css('.CaseDetails-caseNum')).getInnerHtml().then(function(h1) {
          // console.log("h1 is: "+h1);
          // h1 is: MK-1983-0912
          utils.expectUrl(APP_BASE_URL+ newCaseUrl, h1 + '/');
        });

      });
    });

    describe('Case List Navigation', function () {
      it('should keep query params from case_list when going back from case_detail', function () {
        browser.get(APP_BASE_URL);

        browser.getLocationAbsUrl().then(function(url) {
          utils.expectUrl(url, APP_BASE_URL);
        });

        // add some query params by sending a search
        var searchBox = browser.findElement(by.name('q'));

        searchBox.sendKeys('Foo123');
        expect(searchBox.getAttribute('value')).toBe('Foo123');
        browser.findElement(by.id('search')).submit();
        browser.getLocationAbsUrl().then(function (url) {
          var searched_url = url;

          // create a case

          browser.findElement(by.id('create_case')).click();
          // go back & see that query params have been retained.

          browser.findElement(by.cssContainingText('a','Back to cases')).click();
          browser.getLocationAbsUrl().then(function (url2) {
            expect(searched_url).toBe(url2);
          });
        });
      });
    });

    describe('Case Detail', function() {
      it('should get case list when given non existant case reference', function() {
        browser.get('call_centre/XX-0000-0000/');
        browser.getLocationAbsUrl().then(function(url) {
          utils.expectUrl(url, APP_BASE_URL);

          browser.findElement(by.css('.Notice.error')).getInnerHtml().then(function(el) {
            expect(el).toBe('The Case XX-0000-0000 could not be found!');
          });
        });
      });
    });

    describe('Create Case with Adaptations', function () {
      it('should create a new case with the BSL - Webcam adaptation', function () {
        utils.createCase();
        utils.showPersonalDetailsForm();
        utils.enterPersonalDetails({
          'full_name': 'Foo Bar Quux',
          'postcode': 'F00 B4R',
          'street': '1 Foo Bar',
          'mobile_phone': '0123456789'
        });
        showAdaptationsOptions();
        selectAdaptations(['bsl_webcam']);
        utils.saveCase();
        expect(displayedAdaptation()).toBe('BSL - Webcam');
      });

      function showAdaptationsOptions() {
        browser.findElement(by.css('#show_adaptations')).click();
      }

      function selectAdaptations(checkboxes) {
        checkboxes.map(function (name) {
          browser.findElement(by.css('[name=' + name + '] + span')).click();
        });
      }

      function displayedAdaptation() {
        return browser.findElement(by.repeater('item in selected_adaptations').row(0)).getText();
      }
    });

    describe('Case Set Matter Types and Assign', function() {
      function goto_assign() {
        browser.findElement(by.css('.CaseDetails-actions button.Button--dropdown')).click();
        return browser.findElement(by.css('a.Button[ng-click^=assign_to_provider]')).click();
      }

      function fill_required_fields() {
        utils.fillField('notes', 'Case notes.');
        browser.findElement(by.css('button[name="save-case"]')).click();
        utils.setCategory('debt');

        utils.showPersonalDetailsForm();
        utils.enterPersonalDetails({
          'full_name': 'Foo Bar Quux',
          'mobile_phone': '0123456789'
        });
        utils.saveCase();
      }

      function fill_recommended_fields() {
        utils.showPersonalDetailsForm();
        utils.enterPersonalDetails({
          'postcode': 'F00 B4R',
          'street': '1 Foo Bar'
        });
        utils.saveCase();
      }

      function checkAssign() {
        expect(browser.isElementPresent(by.css('.ContactBlock'))).toBe(true);
        expect(browser.isElementPresent(by.css('[data-centre-col] .Notice'))).toBe(true);
        expect(browser.findElement(by.css('.PageHeader h1')).getText()).toContain('Assigned to');
        expect(browser.findElement(by.css('[data-centre-col] .Notice')).getText()).toContain('Provider phone short code');
      }

      it('should not allow assigning a case without required fields', function () {
        utils.createCase();
        goto_assign();

        expect(browser.isElementPresent(by.css('.modal-content .Error[data-case-errors]'))).toBe(true);
        expect(browser.findElement(by.css('.modal-content .Error[data-case-errors]')).getText()).toContain('Name is required to close a case');
      });

      it('should give a warning when assigning a case without address fields', function () {
        utils.createCase();
        fill_required_fields();
        goto_assign();

        expect(browser.isElementPresent(by.css('.modal-content .Notice[data-case-warnings]'))).toBe(true);
        expect(browser.findElement(by.css('.modal-content .Notice[data-case-warnings]')).getText()).toContain('It is recommended to include postcode before closing a case');
      });


      it('should show modal when trying to assign without matter types set', function () {
        utils.createCase();
        fill_required_fields();
        fill_recommended_fields();
        goto_assign();

        expect(browser.findElement(by.css('.modal-content')).getText()).toContain('Set Matter Types');
      });

      it('should not allow saving modal without setting matter type 1 and 2', function () {
        utils.createCase();
        fill_required_fields();
        fill_recommended_fields();
        goto_assign();

        var modalEl = browser.findElement(by.css('div.modal'));
        modalEl.findElement(by.css('button[type="submit"')).click();
        expect(modalEl.isElementPresent(by.css('button[type="submit"'))).toBe(true);
      });


      it('should allow saving modal after setting matter type 1 and 2', function () {
        utils.createCase();
        fill_required_fields();
        fill_recommended_fields();
        goto_assign();

        var modalEl = browser.findElement(by.css('div.modal'));
        modalEl.findElement(by.css('input[name="matter_type1"]')).click();
        modalEl.findElement(by.css('input[name="matter_type2"]')).click();
        modalEl.findElement(by.css('button[type="submit"')).click();
        expect(browser.isElementPresent(by.css('div.modal'))).toBe(false);
      });

      it('should go straight to assign page if MT1 and MT2 are already set', function () {
        utils.createCase();
        fill_required_fields();
        fill_recommended_fields();
        goto_assign();

        expect(browser.findElement(by.css('.modal-content')).getText()).toContain('Set Matter Types');

        var modalEl = browser.findElement(by.css('div.modal'));
        modalEl.findElement(by.css('input[name="matter_type1"]')).click();
        modalEl.findElement(by.css('input[name="matter_type2"]')).click();
        modalEl.findElement(by.css('button[type="submit"')).click();
        expect(browser.isElementPresent(by.css('div.modal'))).toBe(false);

        var assignCaseUrl;
        browser.getLocationAbsUrl().then(function (url) {
          assignCaseUrl = url;
        });
        browser.findElement(by.css('a[ui-sref="case_detail.edit"]')).click();
        browser.findElement(by.css('.CaseDetails-actions button.Button--dropdown')).click();
        browser.findElement(by.css('a.Button[ng-click^=assign_to_provider]')).click();
        expect(browser.isElementPresent(by.css('div.modal'))).toBe(false);
        browser.getLocationAbsUrl().then(function (url) {
          expect(url).toBe(assignCaseUrl);
        });
      });

      it('should not throw warnings/errors when assigning case with personal details completed', function () {
        utils.createCase();
        fill_required_fields();
        fill_recommended_fields();
        goto_assign();

        expect(browser.findElement(by.css('.modal-content')).getText()).toContain('Set Matter Types');
        var modalEl = browser.findElement(by.css('div.modal'));
        modalEl.findElement(by.css('input[name="matter_type1"]')).click();
        modalEl.findElement(by.css('input[name="matter_type2"]')).click();
        modalEl.findElement(by.css('button[type="submit"')).click();
        expect(browser.isElementPresent(by.css('div.modal'))).toBe(false);

        // browser.findElement(by.css("input[name='provider']:first-child")).click();
        browser.findElement(by.css('button[name="assign-provider"]')).click();

        checkAssign();
      });
    });

    describe('Set media code on case', function () {
      it('should set a media code on a new case', function () {
        utils.createCase();
        utils.showPersonalDetailsForm();
        utils.enterPersonalDetails({
          'full_name': 'Foo Bar Quux',
          'postcode': 'F00 B4R',
          'street': '1 Foo Bar',
          'mobile_phone': '0123456789'
        });
        selectMediaCode('Age Concern');
        utils.saveCase();
        expect(displayedMediaCode()).toBe('Age Concern');
      });

      function selectMediaCode(code_name) {
        browser.findElement(by.css('.selectize-control')).click();
        var field = browser.findElement(by.css('.ui-select-search'));
        field.sendKeys(code_name);
        field.sendKeys(protractor.Key.ENTER);
      }

      function displayedMediaCode() {
        return browser.findElement(by.binding('mediaCode(media_code.selected).name')).getText();
      }
    });
  });
})();