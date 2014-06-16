'use strict';
(function(){
// APP
  angular.module('cla.app',
    [
      'ngSanitize',
      'angularMoment',
      'ui.router',
      'cla.controllers',
      'cla.services',
      'cla.filters',
      'cla.directives',
      'cla.states',
      'cla.utils'
    ])
    .config(function($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .run(function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    });
  angular.module('cla.controllers',[]);
  angular.module('cla.services',['ngResource']);
  angular.module('cla.filters',[]);
  angular.module('cla.directives',[]);
  angular.module('cla.states',[]);
  angular.module('cla.utils',[]);
})();