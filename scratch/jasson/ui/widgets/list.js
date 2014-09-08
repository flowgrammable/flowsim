
(function(){

var fgList = function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'widgets/list.html',
    scope: {
      onAdd: '&',
      onDel: '&',
      onSet: '&'
    },
    controller: function($scope) {
      $scope.itemName = '';
      $scope.focus = -1;
      $scope.errorOccurred = false;
      $scope.errorMessage = '';

      $scope.items = [];
      $scope.init = false;

      $scope.on('initList', function(event, data) {
        $scope.items = data;
        $scope.init = true;
      });

      $scope.clearState = function() {
        $scope.itemName = '';
        $scope.errorOccurred = false;
        $scope.errorMessage = '';
      };

      $scope.shiftFocus = function(pos) {
        $scope.focus = pos;                   // Update the local focus
        $scope.onSet()($scope.items[pos]);    // Update the parent with new name
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
};

var fgWidgets = angular.module('fgWidgets');
fgWidgets.directive('fgList', fgList);

})();
