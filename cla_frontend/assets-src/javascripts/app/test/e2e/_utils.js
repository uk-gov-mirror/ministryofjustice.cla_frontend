'use strict';

var protractor = require('protractor');
var APP_BASE_URL = 'call_centre/';

function setUp(){
  var pro = protractor.getInstance();
  var driver = pro.driver;

  driver.get(pro.baseUrl + 'call_centre/login/');

  driver.findElement(by.id('id_username')).sendKeys('test_operator');
  driver.findElement(by.id('id_password')).sendKeys('test_operator');
  driver.findElement(by.css('form')).submit();

  // kill django debug toolbar if it's showing
  pro.manage().addCookie('djdt', 'hide');
}


function fillField(name, value) {
  browser.findElement(by.css('[name="' + name + '"]')).sendKeys(value);
}
function expectUrl(absUrl, expectedUrl) {
  var pro = protractor.getInstance();

  expect((new RegExp(expectedUrl+'$')).test(absUrl)).toBe(true,
    ['Expected', absUrl, 'to be', pro.baseUrl+expectedUrl].join(' ')
  );
}

function getCase(case_id) {
  return browser.get(APP_BASE_URL + case_id + '/');
}

module.exports = {
  APP_BASE_URL: APP_BASE_URL,

  scrollTo: function (element) {
    browser.executeScript(function () {
      arguments[0].scrollIntoView();
    }, element);
  },

  expectUrl: expectUrl,
  setUp: setUp,

  getCase: getCase,

  createCase: function() {
    var pro = protractor.getInstance();

    browser.get(APP_BASE_URL);
    browser.getLocationAbsUrl().then(function (url) {
      expectUrl(url, APP_BASE_URL);
    });
    browser.findElement(by.css('.newCaseForm')).submit();
    return element.all(by.binding('case.reference')).get(0).getText();
  },

  showPersonalDetailsForm: function() {
    browser.findElement(by.css('#personal_details .VCard-view')).click();
  },

  enterPersonalDetails: function(details) {
    for (var name in details) {
      if (name == 'media_code') {
        browser.findElement(by.css('.selectize-control')).click();
        var field = browser.findElement(by.css('input.ui-select-search'));
        field.sendKeys(details[name]);
        field.sendKeys(protractor.Key.RETURN);
      } else {
        fillField(name, details[name]);
      }
    }

  },

  fillField: fillField,

  saveCase: function() {
    browser.findElement(by.css('button[name="save-personal-details"]')).click();
    this.scrollTo(browser.findElement(by.id('personal_details')));
  },

  setCategory: function(category) {
    browser.findElement(by.cssContainingText('button','New means test')).click();
    browser.findElement(by.css('.Accordion-sectionTitle')).click();
    browser.findElement(by.css('input[name="category"][value="' + category + '"]')).click();
    browser.findElement(by.css("button[name='save-means-test']")).click();
  }


};

