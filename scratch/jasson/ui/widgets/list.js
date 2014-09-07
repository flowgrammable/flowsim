
var fgWidgets = angular.module('fgWidgets');

fgWidgets.directive('fgList', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'widgets/list.html',
    scope: {
      getItems: '&',
      onAdd: '&',
      onDel: '&',
      setItem: '&'
    },
    controller: function($scope) {
      $scope.itemName = '';
      $scope.items = [];
      $scope.focus = -1;
      $scope.errorOccurred = false;
      $scope.errorMessage = '';

      $scope.clearState = function() {
        $scope.itemName = '';
        $scope.errorOccurred = false;
        $scope.errorMessage = '';
      };

      $scope.shiftFocus = function(pos) {
        $scope.focus = pos;
        $scope.setItem()($scope.items[pos]);
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
      
      $scope.getItems()(function(data, err) {
        if(data) {
          $scope.items = data;
          if($scope.items.length > 0) {
            $scope.shiftFocus(0);
          }
        }
      });
    }
  };
});
