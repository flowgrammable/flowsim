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
  console.log('match: '+flow.match.get());

  // Set the flow match/action profile/capabilities
  $scope.matchProfiles = flow.capabilities.match;
  $scope.applyProfiles = flow.capabilities.instruction.apply;
  $scope.writeProfiles = flow.capabilities.instruction.write;

  //$scope.options = Match.getOptions($scope.matches);
  $scope.applyActions = flow.capabilities.instruction.apply;
  $scope.writeActions = flow.capabilities.instruction.write;

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
    $scope.matchList.push(name);
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

  // Grab match subset
  $scope.matches = _(_(flow.capabilities.match.matches).map(
    function(category){
      return {
        category: category.category,
        fields: _(category.fields).map(function(field) {
          if(field.enabled){
            return new Match.MatchField_UI(field, Match.mkByValue(field));
          } else {
            return;
          }
        })
      };
    })).filter(function(category) {
      return category.fields.length > 0;
    });

  $scope.matchNames = _($scope.matches).map(function(category){
    return category.category;
  });

  $scope.activeMatchCategory = null;
  $scope.activeMatchFields = [];

  $scope.updateMatchCategory = function() {
    $scope.activeMatchCategory = _($scope.matches).find(
      function(category) {
        return category.category === $scope.match.category;
      });
    $scope.match.fields = _($scope.activeMatchCategory.fields).map(
      function(match) {
        return match.field;
      });

    //$scope.activeMatch = null;
    $scope.match.field = '';
  };

  $scope.updateMatch = function() {
    $scope.activeMatchField = _($scope.activeMatchCategory.fields).find(
      function(match){
        return match.field === $scope.match.field;
      });
  };

  $scope.addMatch = function() {
    var match;
    if($scope.match){
      match = $scope.activeMatchField.mkType($scope.match.value, $scope.match.mask);
      $scope.flow.match.push(match);
      $scope.pushMatch(match);
    }
  };

  $scope.addApplyAction = function(action) {
    flow.ins.pushApply(action);
  };

  // Grab the subset that is available in our profile
  /*

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
  */

  $scope.match = {
    category: '',
    categories: $scope.matchNames,
    field: '',
    fields: [],
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

//  $scope.matchList = flow.match.matches;

  $scope.matchList =  _(flow.match.matches).map(
    function(match){
            return new Match.MatchField_UI(match, Match.mkByValue(match.field));
          });

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
