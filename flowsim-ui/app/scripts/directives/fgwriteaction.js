'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgApplyAction
 * @description
 * # fgApplyAction
 */
angular.module('flowsimUiApp')
  .directive('fgWriteActions', function () {
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
          categories: [],
          fields: [],
          actions: [],
          category: '',
          field: '',
          action: '',
          value: '',
          type: null
        };

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
        $scope.active.categories = _($scope.available).map(function(category) {
          return category.protocol;
        });

        // Update the depdendent drop boxes
        $scope.updateApplyCategory = function() {
          $scope.activeCategory = _($scope.available).find(
            function(category) {
              return category.protocol === $scope.active.category;
            });
            
          $scope.active.fields = _(_($scope.activeCategory.actions).map(
            function(action) {
              return action.field;
            })).unique();

          $scope.active.type   = null;
          $scope.active.value  = '';
          $scope.active.action = '';
          $scope.active.field  = '';
          $scope.active.actions = [];
        };

        // Update the depdendent drop boxes
        $scope.updateApplyField = function() {
          $scope.activeField = ($scope.activeCategory.actions).filter(
            function(action) {
              return action.field === $scope.active.field;
            });
          $scope.active.actions = _(_($scope.activeField).map(
            function(action) {
              return action.action ? action.action : '';
            })).filter(function(action) {
              return action.length > 0;
            });

          $scope.active.type   = null;
          $scope.active.value  = '';
          $scope.active.action = '';
        };

        // Update the depdendent drop boxes
        $scope.updateApplyAction = function() {
          $scope.active.type = _($scope.activeField).find(
            function(action) {
              return action.field === $scope.active.field &&
                     action.action === $scope.active.action;
            });
          $scope.active.value = '';  
        };

        // Remove the last action
        $scope.popAction = function() {
          $scope.actionList.pop();
        };

        // Add the action ... invoke the callback
        $scope.addAction = function() {
          var action;
          if($scope.active.type && 
             $scope.active.type.test($scope.active.value)) {

            action = $scope.active.type.mkType($scope.active.value);
            $scope.addActionCB()(action);
         
            $scope.active.type     = null;
            $scope.active.action   = ''; 
            $scope.active.value    = '';
            $scope.active.action   = '';
            $scope.active.field    = '';
            $scope.active.category = '';
            $scope.active.fields  = [];
            $scope.active.actions = [];
          } else {
            console.log('can not add');
          }
        };

      }
    };
  });

