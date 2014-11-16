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
  }

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
    categories: ['Internal', 'Ethernet', 'VLAN', 'MPLS'],
    field: '',
    fields: ['Output', 'Group', 'Queue', 'Src', 'Dst', 'Type'],
    action: '',
    actions: ['set', 'dec', 'push', 'pop'],
    value: '',
  };

  $scope.apply = {
    category: '',
    categories: ['Internal', 'Ethernet', 'VLAN', 'MPLS'],
    field: '',
    fields: ['Output', 'Group', 'Queue', 'Src', 'Dst', 'Type'],
    action: '',
    actions: ['set', 'dec', 'push', 'pop'],
    value: '',
  };

  // Grab the subset that is available in our profile
  $scope.matchs = _(flow.capabilities.match.matches).filter(
    function(match) {
    return match.enabled;
  });

  // Grab the subset that is available in our profile
  $scope.applyActions = _(flow.capabilities.instruction.apply).filter(
    function(action) {
      return action.enabled;
  });

  // Grab the subset that is available in our profile
  $scope.writeActions = _(flow.capabilities.instruction.write).filter(
    function(action) {
      return action.enabled;
  });

$scope.ok = function () {
  $modalInstance.close(flow);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};

});
