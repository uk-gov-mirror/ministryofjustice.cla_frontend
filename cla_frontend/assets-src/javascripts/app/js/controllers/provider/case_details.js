(function(){
  'use strict';

  angular.module('cla.controllers.provider')
    .controller('CaseDetailCloseCtrl',
      ['$scope', '$state', 'flash',
        function($scope, $state, flash){
          var case_ref = $scope.case.reference;
          
          $scope.close = function() {
            this.case.$close_case().then(function() {
              $state.go('case_list');
              flash('success', 'Case '+case_ref+' closed successfully.');
            });
          };
        }
      ]
    );

  angular.module('cla.controllers.provider').
    controller('AcceptRejectCaseCtrl', ['$scope', '$modal', 'flash', function($scope, $modal, flash){
      $scope.accept = function() {
        this.case.$accept_case().then(function(data) {
          flash('Case accepted successfully.');
          $scope.case = data;
        });
      };

      $scope.reject = function() {
        $modal.open({
          templateUrl: 'case_detail.outcome_modal.html',
          controller: 'OutcomesModalCtl',
          resolve: {
            'tplVars': function() { 
              return {
                title: 'Reject Case'
              };
            },
            'case': function() { return $scope.case; },
            'event_key': function() { return 'reject_case'; },  //this is also the function name on Case model
            'notes': function() { return ''; },
            'success_msg': function() { return 'Case '+$scope.case.reference+' rejected successfully'; }
          }
        });
      };
    }]);
})();