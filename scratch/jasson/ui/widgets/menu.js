
var fgWidgets = angular.module('fgWidgets');

fgWidgets.directive('fgMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'widgets/menu.html',
    link: function(scope, element, attrs) {
    },
    controller: function($scope) {
      $scope.items = [];
      $scope.focus = 0;

      $scope.setFocus = function(pos) {
        $scope.focus = pos;
      };
    }
  };
});

