
var fgPacket = angular.module('fgPacket', []);

var Packet = function() {
};

fgPacket.controller('packetCtrl', function($scope) {

  var namePattern = /[a-zA-Z_][a-zA-Z_0-9]*/;
  $scope.packets = {};
  $scope.names = ['one', 'two'];
  $scope.packet = null;
  $scope.hide = false;

  // This function is called by the UI widet to
  // provide an array of strings of all existing
  // packets
  $scope.listPackets = function(cb) {
    cb($scope.names, null);
  }

  // This function is called by the UI widget to
  // create a new named packet
  $scope.addPacket = function(name) {
    if(!namePattern.test(name)) {
      return 'Bad name';
    } else if(name in $scope.packets) {
      return 'Name exists';
    } else {
      $scope.packets[name] = new Packet();
      return 'success';
    }
  }

  // This function is called by the UI widget to
  // delete a named packet
  $scope.delPacket = function(name) {
    if(name in $scope.packets) {
      delete $scope.packets[name];
    }
  }

  // This function is called by the UI widget to
  // change the focus of a named packet
  $scope.setPacket = function(name) {
    if(typeof name === 'string') {
      $scope.packet = $scope.packets[name];
    } else {
      console.log('all packets have been deleted');
    }
  }

});

