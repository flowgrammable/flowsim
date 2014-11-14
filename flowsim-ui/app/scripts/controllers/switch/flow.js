'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchFlowCtrl
 * @description
 * # SwitchFlowCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchFlowCtrl', function ($scope, $modalInstance, flow) {

  $scope.flow = flow;

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
