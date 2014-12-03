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
          $scope.activeCategory = _($scope.available).find(
            function(category) {
              return category.protocol === $scope.actionCategory;
            });
            
          $scope.actionFields = _(_($scope.activeCategory.actions).map(
            function(action) {
              return action.field;
            })).unique();
          $scope.applyAction  = null;
          $scope.actionField  = '';
          $scope.actionAction = '';
        };

        // Update the depdendent drop boxes
        $scope.updateApplyField = function() {
          $scope.activeField = ($scope.activeCategory.actions).filter(
            function(action) {
              return action.field === $scope.actionField;
            });
          $scope.actionActions = _(_($scope.activeField).map(
            function(action) {
              return action.action ? action.action : '';
            })).filter(function(action) {
              return action.length > 0;
            });
           $scope.applyAction = null;
           $scope.actionAction = '';
        };

        // Update the depdendent drop boxes
        $scope.updateApplyAction = function() {
          $scope.applyAction = _($scope.activeField).find(
            function(action) {
              return action.field === $scope.actionField &&
                     action.action === $scope.actionAction;
            });
        };

        // Remove the last action
        $scope.popAction = function() {
          $scope.actionList.pop();
        };

        // Add the action ... invoke the callback
        $scope.addAction = function() {
          var action;
          if($scope.applyAction && $scope.applyAction.test($scope.actionValue)){
            action = $scope.applyAction.mkType($scope.actionValue);
            $scope.flow.ins.pushApply(action);
            $scope.addActionCB()(action);
          }
        };

      }
    };
  });

