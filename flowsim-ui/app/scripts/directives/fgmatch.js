'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgMatch
 * @description
 * # fgMatch
 */
angular.module('flowsimUiApp')
  .directive('fgMatch', function (Protocols, Noproto) {
    return {
      templateUrl: 'views/fgmatch.html',
      restrict: 'E',
      scope: {
        profiles: '=',
        config: '='
      },
      controller: function($scope) {

        // Get the underlying match set
        $scope.matches = $scope.config.get();
       
        $scope.tip = function( type){
          return Noproto.MatchTips($scope.active.protocol, $scope.active.field, type);
        };
        // Initialize our control variables
        $scope.active = {
          protocols: [],
          protocol: '',
          fields: [],
          field: '',
          value: '',
          mask: '',
          type: null
        };

        // Grab the toplevel profiles
        $scope.enabledProfiles = _($scope.profiles.profiles).filter(
          function(profile) {
            return profile.enabled;
          });

        // Initialize based on root
        $scope.availableProfiles = _(_($scope.enabledProfiles).map(
          function(profile) {
            return profile.clone();
          })).filter(function(profile) {
            return _(Protocols.Root).indexOf(profile.protocol) !== -1;
          });
        


        // Provide a unique array of strings for display
        $scope.updateProtocolsDisplay = function() {
          $scope.active.protocols = _(_($scope.availableProfiles).map(
            function(profile) { 
              return profile.protocol; 
            })).unique();
        };
        $scope.updateProtocolsDisplay();

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
              var result = Protocols.Graph(profile.protocol, profile.field, value);
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
          _($scope.enabledProfiles).each(function(ep){
            if(match.protocol === ep.protocol &&
               match.field === ep.field){
              $scope.use(ep, match.value);
            }
          });
        });

        // Provide a unique array of strings for display
        $scope.updateProtocolsDisplay = function() {
          $scope.active.protocols = _(_($scope.availableProfiles).map(
            function(profile) { 
              return profile.protocol; 
            })).unique();
        };

        // Update the protocol display list
        $scope.updateProtocolsDisplay();
         
        // On protocol selection - update the field choices,
        // clear the active field and inputs
        $scope.updateProtocol = function() {
          $scope.active.fields = _(_($scope.availableProfiles).filter(
            function(profile) {
              return profile.protocol === $scope.active.protocol;
            })).map(function(profile) {
              return profile.field;
            });
          // Clear the dependent properties
          $scope.active.field = '';
          $scope.active.value = '';
          $scope.active.mask  = '';
          $scope.active.type = null;
        };

        // On field selection - set the active type and clear inputs
        $scope.updateField = function() {

          $scope.active.type = _($scope.availableProfiles).find(
            function(profile) {
              return profile.protocol === $scope.active.protocol &&
                     profile.field === $scope.active.field;
            });
          // Clear the dependent properties
          $scope.active.value = '';
          $scope.active.mask  = '';
        };

        $scope.addMatch = function() {
          var match;
          // Value must be valid
          // If mask is present, then mask must be valid
          if($scope.active.value.length > 0 && 
             $scope.active.type.valueTest($scope.active.value) && 
             ($scope.active.mask.length === 0 || 
             (($scope.active.type.wildcardable && $scope.active.value === '0') ||
              ($scope.active.type.maskable && 
               $scope.active.type.maskTest($scope.active.mask))))) {
            // Construct the match
            match = $scope.active.type.mkType($scope.active.value, 
                                              $scope.active.mask);
            // Push the new match onto the match set
            $scope.config.push(match);
            // Run the available/used profile book keeping
            $scope.use($scope.active.type, $scope.active.value);
            // Clear the dependent properties
            $scope.active.protocol = '';
            $scope.active.fields   = [];
            $scope.active.field    = '';
            $scope.active.value    = '';
            $scope.active.mask     = '';
            $scope.active.type     = null;
          }
        };

        $scope.popMatch = function() {
          // Peek at the topmost match
          var m = $scope.config.peekTop();
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
          // Remove the match
          $scope.config.pop();
          // Clear the dependent properties
          $scope.active.protocol = '';
          $scope.active.fields   = [];
          $scope.active.field    = '';
          $scope.active.value    = '';
          $scope.active.mask     = '';
          $scope.active.type     = null;
        };
      }
    };
  });
