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
  $scope.match       = flow.match;
  $scope.instruction = flow.instruction;
  $scope.miss        = flow.miss;

  // Set the flow match/action profile/capabilities
  $scope.matchProfiles = flow.capabilities.match;
  $scope.applyProfiles = flow.capabilities.instruction.apply;
  $scope.writeProfiles = flow.capabilities.instruction.write;

  $scope.insNames = [
    'Meter', 'Apply', 'Clear', 'Write', 'Metadata', 'Goto'
  ];

  $scope.activeIns = {
    meter: flow.ins.meter() ? true : false,
    apply: flow.ins.apply().empty() ? false : true,
    clear: flow.ins.clear() ? true : false,
    write: flow.ins.write().empty() ? false : true,
    metadata: flow.ins.metadata() ? true : false,
    _goto: flow.ins.jump() ? true : false
  };
  $scope.activeIdx = -1;

  $scope.setIns = function(idx) {
    $scope.activeIdx = idx;
  };

  $scope.simpleIns = {
    meter: '',
    goto_: '',
    metadataValue: '',
    metadataMask: ''
  };

  $scope.toggleMeter = function() {
    if(flow.ins.meter()) {
      flow.ins.meter(null);
    }

    $scope.activeIns.meter = !$scope.activeIns.meter;
    $scope.activeIdx = $scope.activeIdx === 0 ? -1 : $scope.activeIdx;
  };

  $scope.setMeter = function() {
    if($scope.simpleIns.meter.length > 0) {
      //FIXME
    }
  };

  $scope.toggleClear = function() {
    if(flow.ins.clear()) {
      flow.ins.clear(null);
    } else {
      flow.ins.clear(true);
    }
    $scope.activeIns.clear = !$scope.activeIns.clear;
    $scope.activeIdx = $scope.activeIdx === 2 ? -1 : $scope.activeIdx;
  };

  $scope.toggleMetadata = function() {
    if(flow.ins.metadata()) {
      flow.ins.metadata(null);
    }
    $scope.activeIns.metadata = !$scope.activeIns.metadata;
    $scope.activeIdx = $scope.activeIdx === 4 ? -1 : $scope.activeIdx;
  };

  $scope.setMetadata = function() {
    if($scope.simpleIns.metadataValue.length > 0 &&
        $scope.simpleIns.metadataMask.length > 0) {
      //FIXME
    }
  };

  $scope.toggleGoto = function() {
    if(flow.ins.jump()) {
      flow.ins.jump(null);
    }
    $scope.activeIns._goto = !$scope.activeIns._goto;
    $scope.activeIdx = $scope.activeIdx === 5 ? -1 : $scope.activeIdx;
  };

  $scope.setGoto = function() {
    if($scope.simpleIns.goto_.length > 0) {
      //FIXME
    }
  };

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
