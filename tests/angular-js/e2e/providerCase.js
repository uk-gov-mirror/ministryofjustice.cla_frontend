(function () {
  'use strict';

  var utils = require('../e2e/_utils');
  var CONSTANTS = require('../protractor.constants.js');
  var modelsRecipe = require('./_modelsRecipe');

  var case_to_accept;
  var grouped_benefits_case;
  var assign_form = element(by.name('assign_provider_form'));
  var accept_button = element(by.name('accept-case'));
  var close_button = element(by.name('provider-close-case'));
  var reopen_button = element(by.name('reopen-case'));
  var debt_referral_button = element(by.name('debt-referral-case'));
  var grouped_text = 'Are you or your partner directly or indirectly in receipt of Universal Credit, Income Support, Income-based Jobseeker\'s Allowance, Income-related Employment and Support Allowance or Guarantee Credit?';
  var specific_text = 'Do you or your partner receive any of the following benefits:';
  var modalEl = element(by.css('div.modal'));

  describe('providerCase', function () {
    describe('An operator', function () {
      beforeEach(utils.setUp);

      it('should create a specific benefits case as operator and assign (manually) to a provider', function () {
        modelsRecipe.Case.createSpecificBenefitsReadyToAssign().then(function (case_ref) {
          case_to_accept = case_ref;
          browser.get(CONSTANTS.callcentreBaseUrl + case_ref + '/assign/?as_of=2014-08-06T11:50');
          get_provider().then(function (provider) {
            if (provider !== 'Duncan Lewis') {
              utils.manuallySetProvider(1); // set to Duncan Lewis
            }
            do_assign();
            expect(browser.getCurrentUrl()).toBe(browser.baseUrl + CONSTANTS.callcentreBaseUrl);
          });
        });
      });

      it('should create a grouped benefits case as operator and assign (manually) to a provider', function () {
        modelsRecipe.Case.createGroupedBenefitsReadyToAssign().then(function (case_ref) {
          grouped_benefits_case = case_ref;
          browser.get(CONSTANTS.callcentreBaseUrl + case_ref + '/assign/?as_of=2014-08-06T11:50');
          get_provider().then(function (provider) {
            if (provider !== 'Duncan Lewis') {
              utils.manuallySetProvider(1); // set to Duncan Lewis
            }
            do_assign();
            expect(browser.getCurrentUrl()).toBe(browser.baseUrl + CONSTANTS.callcentreBaseUrl);
          });
        });
      });

      it('should logout', function () {
        this.after(function () {
          utils.logout();
        });
      });
    });

    describe('A provider', function () {
      beforeEach(utils.setUpAsProvider);

      it('should be able to accept a case', function () {
        browser.get(CONSTANTS.providerBaseUrl + case_to_accept + '/');

        expect(close_button.isPresent()).toBe(false);
        expect(accept_button.isPresent()).toBe(true);

        // click but cancel accept
        accept_button.click();

        // check can't accept anymore
        expect(accept_button.isPresent()).toBe(false);
        expect(close_button.isPresent()).toBe(true);
        expect(element(by.css('.NoticeContainer--fixed')).getInnerHtml()).toContain('Case accepted successfully');
      });

      it('should be able to close a case', function () {
        expect(close_button.isPresent()).toBe(true);

        // click but cancel accept
        close_button.click();
        browser.switchTo().alert().dismiss();

        expect(close_button.isPresent()).toBe(true);

        // click and accept case
        close_button.click();
        browser.switchTo().alert().accept();

        // check redirected
        expect(browser.getLocationAbsUrl()).not.toContain(case_to_accept);
      });

      it('should be able to reopen a case', function () {
        browser.get(CONSTANTS.providerBaseUrl + case_to_accept + '/');

        expect(reopen_button.isPresent()).toBe(true);

        // click
        reopen_button.click();

        expect(modalEl.isPresent()).toBe(true);
        modalEl.element(by.css('textarea[name="notes"]')).sendKeys('Notes.');
        modalEl.element(by.css('button[type="submit"]')).click();
        expect(modalEl.isPresent()).toBe(false);
      });

      it('should be able to close case as debt referral', function () {
        expect(debt_referral_button.isPresent()).toBe(true);

        // click
        debt_referral_button.click();

        expect(modalEl.isPresent()).toBe(true);
        modalEl.element(by.css('textarea[name="notes"]')).sendKeys('Notes.');
        modalEl.element(by.css('button[type="submit"]')).click();
        expect(modalEl.isPresent()).toBe(false);

        // check redirected
        expect(browser.getLocationAbsUrl()).not.toContain(case_to_accept);
      });

      it('should be able to view legal help form with specific benefits', function () {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + 'provider/case/' + case_to_accept + '/legal_help_form/');

        var legal_help_form = element(by.css('.page'));
        expect(legal_help_form.getText()).not.toContain(grouped_text);
        expect(legal_help_form.getText()).toContain(specific_text);

        var universalCredit = element(by.name('universal_credit'));
        var incomeSupport = element(by.name('income_support'));
        var jobSeekers = element(by.name('job_seekers_allowance'));

        expect(universalCredit.getAttribute('value')).toBe('Yes');
        expect(incomeSupport.getAttribute('value')).toBe('No');
        expect(jobSeekers.getAttribute('value')).toBe('');
      });

      it('should be able to view legal help form with grouped benefits', function () {
        browser.get(browser.baseUrl + 'provider/case/' + grouped_benefits_case + '/legal_help_form/');

        var legal_help_form = element(by.css('.page'));
        expect(legal_help_form.getText()).toContain(grouped_text);
        expect(legal_help_form.getText()).not.toContain(specific_text);

        browser.ignoreSynchronization = false;
        browser.get(CONSTANTS.providerBaseUrl + grouped_benefits_case + '/');
      });

      it('should logout', function () {
        this.after(function () {
          utils.logout();
        });
      });
    });
  });

  // helpers
  function get_provider () {
    return element(by.css('.ContactBlock-heading')).getText();
  }

  function do_assign () {
    assign_form.submit();
  }
})();