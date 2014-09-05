
var fgWidgets = angular.module('fgWidgets');

fgWidgets.directive('fgStack', function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'widgets/stack.html',
    scope: {
      addNode: '&',
      delNode: '&',
      setAttr: '&'
    },
    controller: function($scope) {
      $scope.nodeType = '';
      $scope.options = ['ARP', 'MPLS', 'IPv4'];
      $scope.list = [
        {name: 'Ethernet', body: 'stuff...'},
        {name: 'ARP', body: 'stuff...'}
      ];

      $scope.addNode = function() {
        console.log($scope.nodeType);
        $scope.list.push({name: $scope.nodeType, body: 'stuff'});
      }

      $scope.delNode = function(pos) {
        $scope.list.splice($scope.list.length-1, 1);
      }
    }
  };
});

