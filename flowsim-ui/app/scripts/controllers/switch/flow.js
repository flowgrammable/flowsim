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
    fields: ['Output', 'Group', 'Queue', 'Src', 'Dst', 'Type'],
    action: '',
    actions: ['set', 'dec', 'push', 'pop'],
    value: '',
  };

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
