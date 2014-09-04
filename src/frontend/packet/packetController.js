
var flowsimApp = angular.module('flowsimApp');

flowsimApp.controller('packetController', 
  function($scope, $rootScope, packetManager) {

    // Packet Input value
    $scope.name = '';

    // Packet focused on in packet list
    $scope.focus = -1;

    // User Input Error Flags
    $scope.nameExists = false;
    $scope.badName = false;

    // Set the display list
    $scope.packets = packetManager.getPackets();

    // House keeping for shifting foucs
    $scope.shiftFocus = function(pos) {
      if($scope.focus != pos) {
        $scope.focus = pos;
        $rootScope.broadcast('some stuff');
      }
    }

    // House keeping for clearing the input box
    $scope.clearInput = function() {
      $scope.name = '';
      $scope.nameExists = false;
      $scope.badName = false;
    }

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
