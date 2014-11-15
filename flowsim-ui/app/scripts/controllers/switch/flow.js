'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchFlowCtrl
 * @description
 * # SwitchFlowCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchFlowCtrl', function ($scope, $modalInstance, flow, Match) {

  $scope.flow = flow;
  $scope.matches = flow.match.toView();
  //$scope.options = Match.getOptions($scope.matches);
  
  $scope.insNames = [
    'Meter', 'Apply', 'Clear', 'Write', 'Metadata', 'Goto'
  ];

  $scope.activeIns = {
    meter: false,
    apply: false,
    clear: false,
    write: false,
    metadata: false,
    _goto: false
  };
  $scope.activeIdx = -1;

  $scope.setIns = function(idx) {
    $scope.activeIdx = idx;
  }

  $scope.createMatch = function(name) {
    $scope.matches.push(Match.mkByName(name));
  //  $scope.options = Match.getOptions($scope.matches);
  };

  $scope.popMatch = function() {
    if($scope.matches.length > 0) {
      $scope.matches.splice(-1, 1);
   //   $scope.options = Match.getOptions($scope.matches);
    }
  };

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
