'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgList
 * @description
 * # fgList
 */
angular.module('flowsimUiApp')
  .directive('fgList', function () {

    return {
      restrict: 'E',                      // HTML Element
      transclude: true,                   // Copy element body in
      templateUrl: 'views/fglist.html',         // Location of template
      scope: {
        onAdd: '&',                       // callback for adding item
        onDel: '&',                       // callback for deleting item
        onSet: '&'                        // callback for changing item focus
      },

      controller: function($scope) {
        $scope.itemName = '';             // input name to create item
        $scope.focus = -1;                // item with current focus
        $scope.errorOccurred = false;     // input name error state
        $scope.errorMessage = '';         // input name error message
        
        $scope.items = [];                // display list of items
        $scope.init = false;              // dislay list initialization state
        
        $scope.$on('initList', function(event, data) {
          $scope.items = data;
          $scope.init = true;
          if(data.length > 0) {
            $scope.shiftFocus(0);
          }
        });

        $scope.clearState = function() {
          $scope.itemName = '';
          $scope.errorOccurred = false;
          $scope.errorMessage = '';
        };
        
        $scope.shiftFocus = function(pos) {
          if(pos >= -1 && pos < $scope.items.length) {
            $scope.focus = pos;                   // Update the local focus
            $scope.onSet()($scope.items[pos]);    // Update the parent with name
          }
        };
        
        $scope.addItem = function() {
          var result = $scope.onAdd()($scope.itemName);
          if(result == 'success') {
            $scope.items.push($scope.itemName);
            $scope.shiftFocus($scope.items.length-1);
            $scope.clearState();
          } else {
            $scope.errorOccurred = true;
            $scope.errorMessage = result;
          }
        };
        
        $scope.delItem = function(pos) {
          var item;
          if(pos >= -1 && pos < $scope.items.length) {
            item = $scope.items.splice(pos, 1); 
            if(pos < $scope.focus) {
              $scope.shiftFocus($scope.focus-1);
            } else if(pos <= $scope.focus) {
              $scope.shiftFocus($scope.focus);
            }
            $scope.onDel()(item);
          }
        };
      }
    };
  });

