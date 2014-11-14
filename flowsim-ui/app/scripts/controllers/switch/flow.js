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

  $scope.setDirty = function() {
    // update the flow
  };

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
