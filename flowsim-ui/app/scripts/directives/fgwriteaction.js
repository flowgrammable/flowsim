'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgApplyAction
 * @description
 * # fgApplyAction
 */
angular.module('flowsimUiApp')
  .directive('fgWriteActions', function (Protocols) {
    return {
      templateUrl: 'views/fgWriteAction.html',
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
        $scope.updateProfiles = function() {
          $scope.availableProfiles = _($scope.enabledProfiles).filter(
            function(profile) {
              return profile.protocol === 'Internal' || 
                     profile.protocol === 'Ethernet' ||
                     _($scope.match).some(function(_match) {
                       var candidate = Protocols.Graph(_match.protocol, 
                                                       _match.field, 
                                                       _match.value);
                       return candidate === profile.protocol;
                    });
            });
        };
        $scope.updateProfiles();

        // Intialize the used profile to empty
        $scope.usedProfiles = [];

        // Update our book keeping for using a profile
        $scope.use = function(profile, value) {
          // Remove from availableProfiles
          $scope.availableProfiles = _($scope.availableProfiles).reject(
            function(_profile) {
              return profile.protocol === _profile.protocol &&
                     profile.field === _profile.field;
              });
          // Add to usedProfiles
          $scope.usedProfiles.push(profile);
          // Locate any new profiles
          $scope.availableProfiles = $scope.availableProfiles.concat(
            _($scope.enabledProfiles).filter(
              function(_profile) {
                var candidate = _profile.protocol;
                var result = Protocols.Graph(profile.protocol, profile.field, 
                                             value);
                return candidate === result;
              }));
          // Update availabe list
          $scope.updateProtocolsDisplay();
        };
       
        // Update our book keeping for freeing a profile
        $scope.free = function(profile, value) {
          // Remove from usedProfiles
          $scope.usedProfiles = _($scope.usedProfiles).reject(
            function(_profile) {
              return profile.protocol === _profile.protocol &&
                     profile.field === _profile.field;
              });
          // Add to availableProfiles
          $scope.availableProfiles.push(profile);
          // Remove any available protocols that are dependencies of profile
          $scope.availableProfiles = _($scope.availableProfiles).reject(
            function(_profile) {
              return Protocols.Graph(profile.protocol, profile.field, value) ===
                     _profile.protocol;
              });
          // Update availabe list
          $scope.updateProtocolsDisplay();
        };

        // Go through each active match and 
        _($scope.matches).each(function(match) {
          var candidate = _($scope.availableProfiles).find(function(profile) {
            return profile.protocol === match.protocol &&
                   profile.field === match.field;
          });
          if(candidate === undefined) {
            throw 'Failed to find: '+match+ 'in availableProfiles';
          }
          $scope.use(candidate);
        });

        // Build a top-level list of avaiable apply action names
        $scope.updateProtocols = function() {
          $scope.active.protocols = _(_($scope.availableProfiles).map(
            function(profile) {
              return profile.protocol;
            })).unique();
          };
        $scope.updateProtocols();
        
        // Re-run on changes to the underlying match set ... new protocols may
        // be available upon more matches
        $scope.$watch('match', function() { 
          $scope.updateProfiles(); 
          $scope.updateProtocols();
        }, true);

        // Update the depdendent drop boxes
        $scope.updateProtocol = function() {
          $scope.activeFields = _($scope.availableProfiles).filter(
            function(profile) {
              return profile.protocol === $scope.active.protocol;
            });
            
          $scope.active.fields = _(_($scope.activeFields).map(
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
        $scope.updateOp = function() {
          $scope.active.type = _($scope.activeOps).find(
            function(profile) {
              return profile.op === $scope.active.op;
            });
          $scope.active.value = '';  
        };

        // Remove the last action
        $scope.popAction = function() {
          if($scope.actions.length > 0) {
            // Find the used profile that belongs to that match
            var profile = _($scope.usedProfiles).find(function(_profile) {
              return _profile.protocol === m.protocol &&
                     _profile.field === m.field;
            });
            // Fail on the impossible .. throw indicates bug
            if(profile === undefined) {
              throw 'Failed to find usedProfile '+m;
            }
            // Run the used/available book keeping on the profile
            $scope.free(profile, m.value);

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
             !$scope.active.type.valueTest($scope.active.value)) {
            throw 'Add apply action failed: '+$scope.active.value;
          }

          // Construct the aciton type and add to the list
          action = $scope.active.type.mkType($scope.active.value);
          $scope.actions.push(action);

          // Run the available/used profile book keeping
          $scope.use($scope.active.type, $scope.active.value);
        
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

