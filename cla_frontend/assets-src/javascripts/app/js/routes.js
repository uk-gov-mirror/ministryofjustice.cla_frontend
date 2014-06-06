'use strict';
(function(){
//ROUTES
  angular.module('cla.app')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
      $locationProvider.html5Mode(true);
      var states = angular.module('cla.states');
      $stateProvider
        .state('layout', states.Layout)
        .state('case_list', states.CaseListState)
        .state('case_detail', states.CaseDetailState)
        .state('case_detail.edit', states.CaseEditDetailState)
        .state('case_detail.edit.assign', states.CaseEditDetailAssignState)
        .state('case_detail.edit.decline_specialists', states.CaseDetailDeclineSpecialistsState);
    });
})();
