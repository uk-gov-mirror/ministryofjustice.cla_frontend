(function(){
  'use strict';

  angular.module('cla.controllers')
    .controller('EligibilityCheckSummaryCtrl',
      ['$scope', '$http',
        function($scope, $http) {
          if ($scope.case.eligibility_check) {
            $http.get('/call_centre/case/'+$scope.case.reference+'/means_summary/').success(function(data) {
              $scope.means_summary = data;
            });
          }

          $scope.eligibilityTitle = function () {
            return $scope.eligibility_check.isEligibilityTrue() ? 'Eligible for Legal Aid' : ($scope.eligibility_check.isEligibilityFalse() ? 'Not eligible for Legal Aid' : 'Means test');
          };
          $scope.eligibilityTitleClass = function () {
            return $scope.eligibility_check.isEligibilityTrue() ? 'Icon Icon--lrg Icon--tick Icon--green' : ($scope.eligibility_check.isEligibilityFalse() ? 'Icon Icon--lrg Icon--cross Icon--red' : '');
          };
        }
      ]
    );
})();