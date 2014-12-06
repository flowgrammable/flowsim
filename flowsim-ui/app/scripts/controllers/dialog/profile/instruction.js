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
                                                        fgConstraints, name,
                                                        instruction) {
    $scope.name = name;
    $scope.instruction = instruction;

    // Capture the enable/disable state for instruction capabilities
    $scope.instructions = [{
      name: 'Meter',
      enabled: instruction.caps.meter 
    }, {
      name: 'Apply',
      enabled: instruction.caps.apply
    }, {
      name: 'Clear',
      enabled: instruction.caps.clear
    }, {
      name: 'Write',
      enabled: instruction.caps.write
    }, {
      name: 'Metadata',
      enabled: instruction.caps.metadata
    }, {
      name: 'Goto',
      enabled: instruction.caps.goto_
    }];

    // Index tracking and inputs
    $scope.active = {
      index: -1,
      // Input values
      metadataMaskableBits: '',
      gotoValue: '',
      gotoValues: []
    };

    // Organize the action profiles in cels of like-protocol
    // and rows of 3 columns
    $scope.applyRows = orderProfiles(instruction.apply.profiles);
    $scope.writeRows = orderProfiles(instruction.write.profiles);

    /*
    $scope.goto_ = {
      nextTables : ''
    };
    $scope.errorMsg = '';

    $scope.add = function() {
      var extract = /^([0-9]+)(\.\.([0-9]+))?$/;
      var match, result;
    
      $scope.errorMsg = '';

      if(!$scope.tests.goto_($scope.goto_.nextTables)) {
        $scope.errorMsg = 'Invalid Range';
      } else {
        match = $scope.goto_.nextTables.match(extract);
        result = {};
        if(match[1] && fgConstraints.isUInt(0, 255)(match[1])) {
          result.first = match[1];
        } else {
          $scope.errorMsg = 'Invalid Range';
        }
        if(match[3]) {
          if(fgConstraints.isUInt(0, 255)(match[3]) && 
             parseInt(match[1]) <= parseInt(match[3])) {
            result.second = match[3];
            $scope.instruction.goto_.push(result);
            $scope.goto_.nextTables = '';
          }
          else {
            $scope.errorMsg = 'Invalid Range';
          }
        } else {
          result.second = result.first;
          $scope.instruction.goto_.push(result);
          $scope.goto_.nextTables = '';
        }
      }
    };

    $scope.del = function(idx) {
      $scope.instruction.goto_.splice(idx, 1);
    };
    */

    $scope.ok = function() {
      // Copy the enablements
      $scope.instruction.caps.meter    = $scope.instructions[0].enabled;
      $scope.instruction.caps.apply    = $scope.instructions[1].enabled;
      $scope.instruction.caps.clear    = $scope.instructions[2].enabled;
      $scope.instruction.caps.write    = $scope.instructions[3].enabled;
      $scope.instruction.caps.metadata = $scope.instructions[4].enabled;
      $scope.instruction.caps.goto_    = $scope.instructions[5].enabled;

      $modalInstance.close($scope.instruction);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });
