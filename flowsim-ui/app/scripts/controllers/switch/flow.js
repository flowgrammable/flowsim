'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchFlowCtrl
 * @description
 * # SwitchFlowCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchFlowCtrl', function ($scope, $modalInstance, flow, Match, 
                                          Action) {

  // Attach the match/instruciton/miss properties
  $scope.priority     = flow.priority;
  $scope.match        = flow.match;
  $scope.instruction  = flow.ins;

  // Set the flow match/action profile/capabilities
  $scope.matchProfiles = flow.capabilities.match;
  $scope.applyProfiles = flow.capabilities.instruction.apply;
  $scope.writeProfiles = flow.capabilities.instruction.write;

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
