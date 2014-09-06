
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
        {name: 'Ethernet', fields: [
          { 
            name: 'src',
            value: '00:00:00:00:00:00',
            set: function(v) { return 'success'; }
          }, {
            name: 'dst',
            value: '00:00:00:00:00:00',
            set: function(v) { return 'success'; }
          }, {
            name: 'type',
            value: '0',
            set: function(v) { return 'success'; }
          }
        ]},
        {name: 'ARP', fields: [] }
      ];

      $scope.addNode = function() {
        if($scope.nodeType.length > 0) {
          $scope.list.push({name: $scope.nodeType, body: 'stuff'});
        }
      }

      $scope.delNode = function(pos) {
        $scope.list.splice($scope.list.length-1, 1);
      }
    }
  };
});

