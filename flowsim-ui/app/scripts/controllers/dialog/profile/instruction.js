'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogProfileInstructionCtrl
 * @description
 * # DialogProfileInstructionCtrl
 * Controller of the flowsimUiApp
 */

function orderProfiles(profiles) {
  var rows = [];
  var row = [];
  var cel;
  var count = 0;
  var i;

  var protocols = [];
  var protocol = '';
  var tmp = [];
  _(profiles).each(function(profile) {
    if(protocol !== profile.protocol) {
      protocol = profile.protocol;
      protocols.push(tmp);
      tmp = [];
    }
    tmp.push(profile);
  });
  if(tmp.length > 0) {
    protocols.push(tmp);
  }
  protocols = _(protocols).reject(function(protocol) {
    return protocol.length === 0;
  });
  for(i=0; i<Math.ceil(protocols.length / 3); ++i) {
    rows.push(protocols.slice(i*3, i*3+3));
  }

  return rows;
}

angular.module('flowsimUiApp')
  .controller('DialogProfileInstructionCtrl', function ($scope, $modalInstance, 
                                                        name, instruction) {
    $scope.name = name;
    $scope.instruction = instruction;
    // Provide a specific ordering for the view
    $scope.instructions = [
      instruction.meter,
      instruction.apply,
      instruction.clear,
      instruction.write,
      instruction.metadata,
      instruction.goto_
    ];

    // Index tracking and inputs
    $scope.active = {
      index: -1
    };

    // Organize the action profiles in cels of like-protocol
    // and rows of 3 columns
    $scope.applyRows = orderProfiles(instruction.apply.profiles.profiles);
    $scope.writeRows = orderProfiles(instruction.write.profiles.profiles);

    $scope.ok = function() {
      $modalInstance.close($scope.instruction);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });
