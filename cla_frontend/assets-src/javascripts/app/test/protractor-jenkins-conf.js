var extend = require('extend');
var defaults = require('./protractor-default-conf').config;

exports.config = extend(defaults, {
  multiCapabilities: [
    {
      browserName: 'firefox',
      platform: 'Windows 7',
      version: '31'
    }
  ],
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
});
