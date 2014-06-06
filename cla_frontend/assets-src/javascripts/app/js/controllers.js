'use strict';

(function(){
// CONTROLLERS
  angular.module('cla.controllers')
    .controller('CaseListCtrl', ['$scope', 'Case', '$location', function($scope, Case, $location) {
      $scope.search = $location.search().search || '';
      $scope.orderProp = $location.search().sort || '-created';

      Case.query({search: $scope.search}, function(data) {
        $scope.cases = data;
      });

      $scope.sortToggle = function(currentOrderProp){
        if (currentOrderProp === $scope.orderProp) {
          return '-' + currentOrderProp;
        }
        return currentOrderProp;
      };
    }]);

  angular.module('cla.controllers')
    .controller('SearchCtrl', ['$scope', '$state', '$location', function($scope, $state, $location) {
      $scope.$on('$locationChangeSuccess', function(){
        $scope.search = $location.search().search || '';
      });

      $scope.submit = function() {
        $state.go('case_list', {search: $scope.search, sort:''});
      };

    }]);

  angular.module('cla.controllers')
    .controller('CaseDeclineSpecialists',
      ['$scope', '$state', 'OutcomeCode', 'Case', function($scope, $state, OutcomeCode, Case) {

      /*
        TODO:
          - api should not expect an outcome code as input as it's the only one available for this action
          - a success message should be shown to the user after the action
      */
      $scope.outcome_codes = OutcomeCode.query({action_key: 'decline_specialists'}, function(data) {
        $scope.outcome_code = data[0].code;
      });

      $scope.decline = function() {
        $scope.case.$decline_specialists({
          'outcome_code': $scope.outcome_code,
          'outcome_notes': $scope.outcome_notes
        }, function() {
          $state.go('case_list');
        });
      };
    }]);

})();
