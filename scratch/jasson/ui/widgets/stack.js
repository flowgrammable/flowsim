
var fgWidgets = angular.module('fgWidgets');

fgWidgets.directive('fgStack', function() {
  var pattern = /(([0-9a-fA-F]{1,2})(-|:)){5}([0-9a-fA-F]{1,2})/;
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
            name: 'Src',
            value: '00:00:00:00:00:00',
            tip: 'Ethernet source address, a six byte hexadecimal value',
            test: function(v) { 
              return pattern.test(v);
            }
          }, {
            name: 'Dst',
            value: '00:00:00:00:00:00',
            tip: 'Ethernet destination address, a six byte hexadecimal value',
            test: function(v) { 
              return pattern.test(v);
            }
          }, {
            name: 'Type',
            value: '0',
            tip: 'A two byte hexidecimal value indcating the type of the payload',
            test: function(v) { return 'success'; 
              return true;
            }
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

