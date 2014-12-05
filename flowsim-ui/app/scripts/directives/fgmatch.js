'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgMatch
 * @description
 * # fgMatch
 */
angular.module('flowsimUiApp')
  .directive('fgMatch', function (Protocols) {
    return {
      templateUrl: 'views/fgmatch.html',
      restrict: 'E',
      scope: {
        profiles: '=',
        matches: '=',
        addMatchCB: '&addMatch'
      },
      controller: function($scope) {

        // Grab the toplevel profiles
        $scope.availableProfiles = _($scope.profiles.profiles).filter(
          function(profile) {
            return profile.enabled;
          });

        $scope.active = {
          protocols: Protocols.Root,
          protocol: '',
          fields: [],
          field: '',
          value: '',
          mask: '',
          type: null
        };

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

        $scope.updateField = function() {

          $scope.active.type = _($scope.availableProfiles).find(
            function(profile) {
              return profile.protocol === $scope.active.protocol &&
                     profile.field === $scope.active.field;
            });

          // Clear the dependent properties
          $scope.active.value = '';
          $scope.active.mask  = '';
        }

        $scope.addMatch = function() {
          var match;
          if($scope.active.value.length > 0 && 
             $scope.active.type.valueTest($scope.active.value) &&
             $scope.active.type.maskTest($scope.active.mask)) {
            match = $scope.active.type.mkType($scope.active.value, 
                                              $scope.active.mask);
            $scope.addMatchCB()(match);
          
            // Clear the dependent properties
            $scope.active.field = '';
            $scope.active.value = '';
            $scope.active.mask  = '';
            $scope.active.type = null;
          }
        };

        $scope.popMatch = function() {
          $scope.matches.pop();
        };
      }
    };
  });
