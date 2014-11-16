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
  $scope.match = flow.match;
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
  
  // Grab the subset that is available in our profile
  /*$scope.matches = _(flow.capabilities.match.matches).filter(
    function(match) {
    return match.enabled;
  });
  */

  // Grab the subset that is available in our profile
  $scope.applyActions = _(_(flow.capabilities.instruction.apply).map(
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
  $scope.activeApplyField = [];

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
    console.log('update category: '+$scope.apply.field);
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
    console.log('update category: '+$scope.apply.action);
    $scope.applyAction = _($scope.activeApplyFields).find(
      function(action) {
        return action.name === $scope.apply.field && 
               action.action === $scope.apply.action;
    });
  };

  $scope.addApplyAction = function() {
    var action;
    if($scope.applyAction && $scope.applyAction.test($scope.apply.value)) {
      console.log('got an action to deal with');
      action = $scope.applyAction.mkType($scope.apply.value);
      console.log(action.toString());
    }
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
