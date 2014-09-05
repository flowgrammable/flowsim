
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
      changeFocus: '&'
    },
    controller: function($scope) {
      $scope.itemName = '';
      $scope.items = $scope.getItems()();
      $scope.focus = -1;
      $scope.errorOccurred = false;
      $scope.errorMessage = '';

      $scope.clearState = function() {
        $scope.itemName = '';
        $scope.errorOccurred = false;
        $scope.errorMessage = '';
      }

      $scope.shiftFocus = function(pos) {
        $scope.focus = pos;
        $scope.changeFocus()($scope.items[pos]);
      }

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
      }

      $scope.delItem = function(pos) {
        var item;
        if(pos >= -1 && pos < $scope.items.length) {
          if(pos < $scope.focus) {
            $scope.shiftFocus($scope.focus-1);
          }
          item = $scope.items.splice(pos, 1); 
          $scope.onDel()(item);
        }
      }
    }
  };
});
