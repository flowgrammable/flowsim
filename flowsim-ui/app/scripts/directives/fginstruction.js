'use strict';

angular.module('flowsimUiApp')
  .directive('fgInstruction', function() {
    return {
      templateUrl: 'views/fginstruction.html',
      restrict: 'E',
      scope: {
        flow: '='
      },
      controller: function($scope) {
        $scope.active = {
          index: -1,
          // Input values
          meter: '',
          metadataValue: '',
          metadataMask: '',
          gotoValue: ''
        };
        $scope.instructions = [{
          name: 'Meter',
          enable: false
        }, {
          name: 'Apply',
          enable: false
        }, {
          name: 'Clear',
          enable: false
        }, {
          name: 'Write',
          enable: false
        }, {
          name: 'Metadata',
          enable: false
        }, {
          name: 'Goto',
          enable: false
        }];
      }
    };
  });

