'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgApplyAction
 * @description
 * # fgApplyAction
 */
angular.module('flowsimUiApp')
  .directive('fgApplyActions', function () {
    return {
      templateUrl: 'views/fgApplyAction.html',
      restrict: 'E',
      scope: {
        toplevel:     '=',
        actionList:   '=',
        addActionCB:  '&addAction'
      },
      controller: function($scope) {

        console.log('hello');

        // Input selectors and box
        $scope.actionCategory = '';
        $scope.actionField    = '';
        $scope.actionAction   = '';
        $scope.actionValue    = '';

        // Build a top-level list of available apply actions
        $scope.available = _($scope.toplevel).map(function(category) {
          return {
            protocol: category.protocol,
            actions: _(category.actions).filter(function(action) {
              return action.enabled;
            })
          };
        }).filter(function(category) {
          return category.actions.length > 0;
        });

        // Build a top-level list of avaiable apply action names
        $scope.actionCategories = _($scope.available).map(function(category) {
          return category.protocol;
        });

        // Update the depdendent drop boxes
        $scope.updateApplyCategory = function() {
        };

        // Update the depdendent drop boxes
        $scope.updateApplyField = function() {
        };

        // Update the depdendent drop boxes
        $scope.updateApplyAction = function() {
        };

        // Remove the last action
        $scope.popAction = function() {
          $scope.actionList.pop();
        };

        // Add the action ... invoke the callback
        $scope.addAction = function() {
          // FIXME
          $scope.addActionCB()();
        };

      }
    };
  });

