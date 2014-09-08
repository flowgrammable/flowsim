
var packetCreator = angular.module('packetCreator', ['ngRoute', 'ui.bootstrap']);

packetCreator.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/packet', {
      templateUrl: 'packet.html'
    });
}]);

flowsimApp.controller('packetController', 
  function($scope, $rootScope, packetManager) {
    
    // Method to add a new packet
    $scope.addPacket = function() {
      switch(packetManager.addPacket($scope.name)) {
        case 'nameExists':
          $scope.nameExists = true;
          break;
        case 'badName':
          $scope.badName = true;
          break;
        default:
          // Clear inputs and set focus on new packet
          $scope.clearInput();
          $scope.shiftFocus($scope.packets.length-1);
          break;
      }
    }

    // Method to delete a packet
    $scope.delPacket = function(pos) {
      // deleting pos < focus -- -= 1
      // deleting pos == focus -- -= 1
      // deleting pos > foucs --  do nothing
      if(pos <= $scope.focus)
        $scope.shiftFocus(pos-1);
      packetManager.delPacket(pos);
    }

    // Method to save changes for stale packet
    $scope.savePacket = function(pos) {
      packetManager.savePacket(pos);
    }

  });
