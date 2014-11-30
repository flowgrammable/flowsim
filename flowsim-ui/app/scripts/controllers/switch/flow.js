'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchFlowCtrl
 * @description
 * # SwitchFlowCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchFlowCtrl', function ($scope, $modalInstance, flow, Match, Action) {

  $scope.flow = flow;
  $scope.match = flow.match;
  //$scope.options = Match.getOptions($scope.matches);

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

  $scope.pushMatch = function(name) {
  };

  $scope.popMatch = function() {
  };

  $scope.simpleIns = {
    meter: '',
    goto_: '',
    metadataValue: '',
    metadataMask: ''
  };

  $scope.toggleMeter = function() {
    if($scope.flow.ins.meter()) {
      $scope.flow.ins.meter(null);
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
    if($scope.flow.ins.clear()) {
      $scope.flow.ins.clear(null);
    } else {
      $scope.flow.ins.clear(true);
    }
    $scope.activeIns.clear = !$scope.activeIns.clear;
    $scope.activeIdx = $scope.activeIdx === 2 ? -1 : $scope.activeIdx;
  };

  $scope.toggleMetadata = function() {
    if($scope.flow.ins.metadata()) {
      $scope.flow.ins.metadata(null);
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
    if($scope.flow.ins.jump()) {
      $scope.flow.ins.jump(null);
    }
    $scope.activeIns._goto = !$scope.activeIns._goto;
    $scope.activeIdx = $scope.activeIdx === 5 ? -1 : $scope.activeIdx;
  };

  $scope.setGoto = function() {
    if($scope.simpleIns.goto_.length > 0) {
      //FIXME
    }
  };

  // Grab the subset that is available in our profile
  $scope.applyActions = _(_(flow.capabilities.instruction.apply).map(
    function(category) {
      return {
        protocol: category.protocol,
        actions: _(category.actions).map(function(action) {
          if(action.enabled){
            return new Action.ActionField_UI(action, Action[action.name]);
          } else {
            return;
          }
        })
      };
  })).filter(function(category) {
    return category.actions.length > 0;
  });
  $scope.applyActionNames = _($scope.applyActions).map(function(category) {
    return category.protocol;
  });

  // Grab the subset that is available in our profile
  $scope.writeActions = _(_(flow.capabilities.instruction.write).map(
    function(category) {
      return {
        protocol: category.protocol,
        actions: _(category.actions).filter(function(action) {
          return action.enabled;
        })
      };
  })).filter(function(category) {
    return category.actions.length > 0;
  });
  $scope.writeActionNames = _($scope.writeActions).map(function(category) {
    return category.protocol;
  });

  $scope.activeApplyCategory = null;
  $scope.activeApplyFields = [];

  $scope.updateApplyCategory = function() {
    console.log('update category: '+$scope.apply.category);
    $scope.activeApplyCategory = _($scope.applyActions).find(
      function(category) {
        return category.protocol === $scope.apply.category;
    });
    $scope.apply.fields = _($scope.activeApplyCategory.actions).map(
      function(action) {
        return action.name;
    });
    $scope.applyAction  = null;
    $scope.apply.field  = '';
    $scope.apply.action = '';
  };

  $scope.updateApplyField = function() {
    console.log('update field: '+$scope.apply.field);
    $scope.activeApplyFields = ($scope.activeApplyCategory.actions).filter(
      function(action) {
        return action.name === $scope.apply.field;
    });

    $scope.apply.actions = _(_($scope.activeApplyFields).map(
      function(action) {
        return action.action ? action.action : '';
    })).filter(function(action) {
      return action.length > 0;
    });
    $scope.applyAction = null;
    $scope.apply.action = '';
  };

  $scope.applyAction = null;

  $scope.updateApplyAction = function() {
    $scope.applyAction = _($scope.activeApplyFields).find(
      function(action) {
        return action.name === $scope.apply.field &&
               action.action === $scope.apply.action;
    });
  };

  $scope.addApplyAction = function() {
    var action;
    if($scope.applyAction && $scope.applyAction.test($scope.apply.value)) {
      action = $scope.applyAction.mkType($scope.apply.value);
      $scope.flow.ins.pushApply(action);
    }
  };

  $scope.popApply = function() {
    $scope.applyList.pop();
  };

  $scope.match = {
    category: '',
    categories: ['Internal', 'Ethernet', 'VLAN', 'MPLS'],
    field: '',
    fields: ['Output', 'Group', 'Queue', 'Src', 'Dst', 'Type'],
    value: '',
    mask: ''
  };

  $scope.write = {
    category: '',
    categories: $scope.writeActionNames,
    field: '',
    fields: ['Output', 'Group', 'Queue', 'Src', 'Dst', 'Type'],
    action: '',
    actions: ['set', 'dec', 'push', 'pop'],
    value: '',
  };

  $scope.applyList = flow.ins.apply();

  $scope.apply = {
    category: '',
    categories: $scope.applyActionNames,
    field: '',
    fields: [],
    action: '',
    actions: [],
    value: '',
  };

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
