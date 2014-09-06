
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

      $scope.payloadOptions = {
        Ethernet: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
        VLAN: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
        MPLS: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
        IPv4: ['TCP', 'UDP', 'SCTP', 'ICMPv4', 'ICMPv6'],
        IPv6: ['TCP', 'UDP', 'SCTP', 'ICMPv4', 'ICMPv6']
      };

      $scope.options = $scope.payloadOptions['Ethernet'];

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
        ]}
      ];

      $scope.addNode = function() {
        if($scope.nodeType.length > 0) {
          $scope.list.push({name: $scope.nodeType, body: 'stuff'});
          $scope.options = $scope.payloadOptions[$scope.nodeType];
        }
      }

      $scope.delNode = function(pos) {
        $scope.list.splice($scope.list.length-1, 1);
        $scope.options = $scope.payloadOptions[$scope.list[$scope.list.length-1].name];
      }
    }
  };
});

