'use strict';

angular.module('flowsimUiApp')
  .directive('fgMetadataProfile', function () {
    return {
      templateUrl: 'views/fgmetadataprofile.html',
      restrict: 'E',
      scope: {
        metadata: '=',
      },
      controller: function($scope) {
        // Initialize the input box to be empty
        $scope.active = {
          value: ''
        };
        // Provide a set function that is only called on good input
        $scope.set = function() {
          $scope.metadata.maskableBits = $scope.active.value;
        }
      }
    };
  });
