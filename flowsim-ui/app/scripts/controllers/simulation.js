'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SimulationCtrl
 * @description
 * # SimulationCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SimulationCtrl', function ($scope, $rootScope, fgCache, Trace, 
                                          Switch, Packet, Dataplane, Regex, Simulation) {
                                          
  $scope.names = {};

  $scope.simulation = null;

  $scope.resources = {
    packet: '',
    device: '',
    packets: [],
    devices: []
  };

  $scope.trace = null;

  fgCache.getNames('switch', function(err, result) {
    if(err) {
      console.log(err.details);
    } else {
      $scope.resources.devices = result;
    }
  });

  fgCache.getNames('packet', function(err, result) {
    if(err) {
      console.log(err.details);
    } else {
      $scope.resources.packets = result;
    }
  });
  
  $scope.getTraces = function(callback) {
    fgCache.getNames('trace', callback);
  };
    
  $scope.$watch('resources.device', function() {
    fgCache.get('switch', $scope.resources.device, Switch,
                function(err, device) {
      if(err) {
        console.log(err.details);
      } else {
       $scope.trace.device = device;
      }
    });
  });

  // allow for pushing packets to the list
  $scope.addPacket = function() {
    fgCache.get('packet', $scope.resources.packet, Packet, 
                function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.trace.push(result);
        $scope.resources.packet = '';
      }
    });
  };

  $scope.delPacket = function(idx) {
    $scope.trace.del(idx);
  };

  $scope.addTrace = function(name, callback) {
    if(!Regex.Identifier.test(name)) {
      callback('Bad name');
    } else if(name in $scope.names) {
      callback('Name exists');
    } else {
      $scope.trace = fgCache.create('trace', name, Trace);
      $scope.names[name] = true;
      $scope.setDirty();
      callback(null);
    }
  };

  $scope.delTrace = function(name) {
    fgCache.destroy('trace', name);
    if(fgCache.isDirty()) {
      $scope.setDirty();
    } else {
      $scope.setClean();
    }
    delete $scope.names[name];
  };

  $scope.setTrace = function(name) {
    if(name === undefined) {
      $scope.trace = null;
    } else {
      fgCache.get('trace', name, Trace, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
          $scope.trace = result;
          if($scope.trace.device) {
            $scope.device.name = $scope.trace.device.name;
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

  $scope.simulation = new Simulation.Simulation();

  $scope.play = function() {
    $scope.trace.get(function(err) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.simulation.play($scope.trace);
      }
    });
  };

  $scope.stop = function() {
    $scope.simulation.stop();
  };

  $scope.step = function() {
    $scope.simulation.step();
  };

});
