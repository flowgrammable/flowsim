'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchFlowCtrl
 * @description
 * # SwitchFlowCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchFlowCtrl', function ($scope, $modalInstance, Flow,
                                          priority) {

  $scope.flow = new Flow.Flow(null, priority);

$scope.ok = function () {
  $modalInstance.close($scope.flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
