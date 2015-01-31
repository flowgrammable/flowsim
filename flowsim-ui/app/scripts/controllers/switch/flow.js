'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchFlowCtrl
 * @description
 * # SwitchFlowCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchFlowCtrl', function ($scope, $modalInstance, flow, caps){

  // Attach the match/instruciton/miss properties
  $scope.priority     = flow.priority;
  $scope.match        = flow.match;
  $scope.instruction  = flow.ins;

  // Set the flow match/action profile/capabilities
  $scope.caps = caps;
  $scope.matchProfiles = caps.match;
  $scope.applyProfiles = caps.instruction.apply;
  $scope.writeProfiles = caps.instruction.write;

$scope.ok = function () {
  if(!$scope.instruction.meter.isValid()){
    flow.ins.meter.enabled = false;
  }
  if(!$scope.instruction.goto_.isValid()){
    flow.ins.goto_.enabled = false;
  }
  if(!$scope.instruction.metadata.isValid()){
    flow.ins.metadata.enabled = false;
  }
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
