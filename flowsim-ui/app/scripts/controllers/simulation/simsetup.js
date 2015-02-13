'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SimsetupCtrl
 * @description
 * # SimsetupCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SimSetupCtrl', function ($scope, $rootScope, fgCache, Trace, Switch, Packet, Regex, Simulation) {

  $scope.names = {};

  $scope.resources = {
    packetName: '',     // input selector for adding a packet
    deviceName: '',     // input selector for setting a switch
    packets: [],
    devices: []
  };

  $scope.active = {
    in_port: '',
    in_phy_port: '',
    tunnel: ''
  };
  console.log('trace scopeer:', $scope.trace);
  // get a list of all the existing switch names
  fgCache.getNames('switch', function(err, result) {
    if(err) {
      console.log(err.details);
    } else {
      $scope.resources.devices = result;
    }
  });

  // get a list of all the existing packet names
  fgCache.getNames('packet', function(err, result) {
    if(err) {
      console.log(err.details);
    } else {
      $scope.resources.packets = result;
    }
  });

  // update the switch device on selector change
  $scope.$watch('resources.deviceName', function() {
    fgCache.get('switch', $scope.resources.deviceName, Switch,
                function(err, device) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.player.trace.device = device;
      }
    });
  });

  // attach a method to - get all the existing trace names
  $scope.getTraces = function(callback) {
    fgCache.getNames('trace', callback);
  };

    // add the selected packet to the trace
  $scope.addPacket = function(pkt) {
    fgCache.get('packet', pkt.packetName, Packet,
                function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.player.trace.push(result.clone(), pkt.in_port, 
            pkt.in_phy_port, pkt.tunnel);
      }
    });
  };

    // create a new trace
  $scope.addTrace = function(name, callback) {
    if(!Regex.Identifier.test(name)) {
      callback('Bad name');
    } else if(name in $scope.names) {
      callback('Name exists');
    } else {
      $scope.player.trace = fgCache.create('trace', name, Trace);
      $scope.names[name] = true;
      $scope.setDirty();
      callback(null);
    }
  };

  // set focus on a new trace
  $scope.setTrace = function(name) {
    if(name === undefined) {
      $scope.trace = null;
    } else {
      fgCache.get('trace', name, Trace, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
          $scope.player.trace = result;
          if($scope.player.trace.device) {
            $scope.resources.deviceName = $scope.player.trace.device.name;
          }
        }
      });
    }
  };

  $scope.setDirty = function() {
    $rootScope.$broadcast('dirtyCache');
  };

  $scope.setClean = function() {
    $rootScope.$broadcast('cleanCache');
  };

  $rootScope.$on('$stateChangeStart',function(event){
  	console.log('leaving state');
  });

  });
