'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgApplyAction
 * @description
 * # fgApplyAction
 */
angular.module('flowsimUiApp')
  .directive('fgApplyActions', function (Protocols) {
    return {
      templateUrl: 'views/fgApplyAction.html',
      restrict: 'E',
      scope: {
        toplevel: '=',
        match:    '=',
        actions:  '='
      },
      controller: function($scope) {

        // Input selectors and box
        $scope.active = {
          protocols: [],
          fields:    [],
          ops:       [],
          protocol:  '',
          field:     '',
          op:        '',
          value:     '',
          type:      null
        };

        // Build a top-level list of enabled actions
        $scope.enabledProfiles = _($scope.toplevel).filter(function(profile) {
          return profile.enabled;
        });

        // Filter out all protocols that are not present in match
        $scope.availableProfiles = _($scope.enabledProfiles).filter(
          function(profile) {
            return profile.protocol === 'Internal' || 
                   profile.protocol === 'Ethernet' ||
                   _($scope.match).some(function(_match) {
                     return Protocols.Graph(_match.protocol, _match.field, 
                                            _match.value) === profile.protocol;
                   });
          });

        // Build a top-level list of avaiable apply action names
        $scope.active.protocols = _(_($scope.availableProfiles).map(
          function(profile) {
            return profile.protocol;
          })).unique();

        // Update the depdendent drop boxes
        $scope.updateProtocol = function() {
          $scope.activeFieldss = _($scope.availableProfiles).filter(
            function(profile) {
              return profile.protocol === $scope.active.protocol;
            });
            
          $scope.active.fields = _(_($scope.activeFields).filter(
            function(profile) {
              return profile.field;
            })).unique();

          $scope.active.type    = null;
          $scope.active.value   = '';
          $scope.active.op      = '';
          $scope.active.field   = '';
          $scope.active.actions = [];
        };

        // Update the depdendent drop boxes
        $scope.updateField = function() {
          $scope.activeOps = _($scope.activeFields).filter(
            function(profile) {
              return profile.field === $scope.active.field;
            });
          $scope.active.ops = _($scope.activeOps).map(
            function(profile) {
              return profile.op;
            });

          $scope.active.type   = null;
          $scope.active.value  = '';
          $scope.active.op     = '';
        };

        // Update the depdendent drop boxes
        $scope.updateAction = function() {
          $scope.active.type = _($scope.activeOps).find(
            function(profile) {
              return profile.op === $scope.active.op;
            });
          $scope.active.value = '';  
        };

        // Remove the last action
        $scope.popAction = function() {
          if($scope.actions.length > 0) {
            $scope.actions.splice(-1, 1);
         
            // Flush the inputs on modification
            $scope.active.type     = null;
            $scope.active.value    = '';
            $scope.active.op       = '';
            $scope.active.field    = '';
            $scope.active.protocol = '';
            $scope.active.fields   = [];
            $scope.active.ops      = [];
          }
        };

        // Add the action ... invoke the callback
        $scope.addAction = function() {
          var action;
          if(!$scope.active.type || 
             !$scope.active.type.test($scope.active.value)) {
            throw 'Add apply action failed: '+$scope.active.value;
          }

          // Construct the aciton type and add to the list
          action = $scope.active.type.mkType($scope.active.value);
          $scope.actions.push(action);
        
          // Clearn the selectors and inputs
          $scope.active.type     = null;
          $scope.active.value    = '';
          $scope.active.op       = '';
          $scope.active.field    = '';
          $scope.active.protocol = '';
          $scope.active.fields   = [];
          $scope.active.ops      = [];
        };

      }
    };
  });

