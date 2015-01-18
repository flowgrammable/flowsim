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
        actionset:  '='
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

        // Initialize based on root
        $scope.availableProfiles = _(_($scope.enabledProfiles).map(
          function(profile) {
            return profile.clone();
          })).filter(function(profile) {
            return _(Protocols.Root).indexOf(profile.protocol) !== -1;
          });
        
        // Intialize the used profile to empty
        $scope.usedProfiles = [];

        // Filter out all protocols that are not present in match
        $scope.updateProfiles = function() {
          $scope.availableProfiles =_($scope.enabledProfiles).filter(
            function(profile) {
              return ((profile.protocol === 'Internal' || 
                       profile.protocol === 'Ethernet') &&
                     _($scope.usedProfiles).find(function(_profile) {
                      return profile.protocol === _profile.protocol &&
                             profile.field === _profile.field &&
                             profile.op === _profile.op;
                     }) === undefined) ||
                     _($scope.match).some(
                function(_match) {
                  var candidate = Protocols.Graph(_match.protocol,
                                                  _match.field,
                                                  _match.value);
                  // Add any new profiles that are enabled/available/not used
                  return candidate === profile.protocol &&
                         _($scope.usedProfiles).find(function(_profile) {
                            return profile.protocol === _profile.protocol &&
                                   profile.field === _profile.field &&
                                   profile.op === _profile.op;
                         }) === undefined;
                });
            });
        };
        $scope.updateProfiles();

        // Build a top-level list of avaiable apply action names
        $scope.updateProtocols = function() {
          $scope.active.protocols = _(_($scope.availableProfiles).map(
            function(profile) {
              return profile.protocol;
            })).unique();
        };
        $scope.updateProtocols();

        // Update our book keeping for using a profile
        $scope.use = function(profile) {
          // Remove from availableProfiles
          $scope.availableProfiles = _($scope.availableProfiles).reject(
            function(_profile) {
              return profile.protocol === _profile.protocol &&
                     profile.field === _profile.field &&
                     profile.op === _profile.op;
              });
          // Add to usedProfiles
          $scope.usedProfiles.push(profile);
          // Locate any new profiles
          $scope.updateProtocols();
        };
       
        // Update our book keeping for freeing a profile
        $scope.free = function(profile) {
          // Remove from usedProfiles
          $scope.usedProfiles = _($scope.usedProfiles).reject(
            function(_profile) {
              return profile.protocol === _profile.protocol &&
                     profile.field === _profile.field && 
                     profile.op === _profile.op;
              });
          // Add to availableProfiles
          $scope.availableProfiles.push(profile);
          // Update availabe list
          $scope.updateProtocols();
        };

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
        $scope.popAction = function(index) {
          if($scope.listView.length > 0) {
            var a = $scope.listView.splice(index, 1);
            // Find the used profile that belongs to that match
            var profile = _($scope.usedProfiles).find(function(_profile) {
              return _profile.protocol === a[0].protocol &&
                     _profile.field === a[0].field &&
                     _profile.op === a[0].op;
            });
            // Fail on the impossible .. throw indicates bug
            if(profile === undefined) {
              throw 'Failed to find usedProfile '+a;
            }
            // Run the used/available book keeping on the profile
            $scope.free(profile);

            // Remove action from set
            $scope.actionset.removeAction(a[0].protocol, a[0].field, a[0].op);
         
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
          if($scope.active.op === 'set' && 
            !$scope.active.type.valueTest($scope.active.value)) {
            throw 'Add apply action failed: '+$scope.active.value;
          }

          // Construct the aciton type and add to the list
          action = $scope.active.type.mkType($scope.active.value);
          $scope.actionset.add(action);

          // Run the available/used profile book keeping
          $scope.use($scope.active.type);
        
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

