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
    packetName: '',     // input selector for adding a packet
    deviceName: '',     // input selector for setting a switch
    packets: [],
    devices: []
  };

  $scope.trace = null;

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
 
  // attach a method to - get all the existing trace names
  $scope.getTraces = function(callback) {
    fgCache.getNames('trace', callback);
  };
  
  // update the switch device on selector change
  $scope.$watch('resources.deviceName', function() {
    fgCache.get('switch', $scope.resources.deviceName, Switch,
                function(err, device) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.trace.device = device;
      }
    });
  });

  // add the selected packet to the trace
  $scope.addPacket = function() {
    fgCache.get('packet', $scope.resources.packetName, Packet, 
                function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.trace.push(result.toBase());
        $scope.resources.packetName = '';
      }
    });
  };

  // delete the indicated packet from the trace
  $scope.delPacket = function(idx) {
    $scope.trace.del(idx);
  };

  // create a new trace
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

  // delete a trace
  $scope.delTrace = function(name) {
    fgCache.destroy('trace', name);
    if(fgCache.isDirty()) {
      $scope.setDirty();
    } else {
      $scope.setClean();
    }
    delete $scope.names[name];
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
          $scope.trace = result;
          if($scope.trace.device) {
            $scope.resources.deviceName = $scope.trace.device.name;
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
  $scope.view = null;

  $scope.stages = Simulation.Stages;
  $scope.transitions = Simulation.Transitions;

  function hideDetails(state) {
    return (state === 5 || state === 6) ? 4 : state;
  }
  
  $scope.makeTransition =  {to:-1};
  $scope.play = function() {
    $scope.simulation.play($scope.trace);
    $scope.makeTransition = { 
      to: $scope.simulation.stage
          //hideDetails($scope.simulation.stage) 
    };
    $scope.view = $scope.simulation.toView();
    $scope.ctx = {
            packetCnt: 5,
            ctx: [{
                name: 'buffer',
                value: 12344
            }, {
                name: 'meter',
                value: 124
            }, {
                name: 'table',
                value: 0
            }],
            key: [{
                name: 'Internal',
                attrs: [{
                    name: 'in_port',
                    value: 4,
                }, {
                    name: 'in_phy_port',
                    value: 6,
                }, {
                    name: 'tunnel',
                    value: 12435
                }]
            }, {
                name: 'Ethernet',
                attrs: [{
                    name: 'in_port',
                    value: 4,
                }, {
                    name: 'in_phy_port',
                    value: 6,
                }, {
                    name: 'tunnel',
                    value: '0xffffffffffffffff'
                }, {
                    name: 'tunnel',
                    value: 12435
                }]

            }]
        };
    $scope.packetName = 'pack1'; //TODO - add real name

  };

  $scope.stop = function() {
    $scope.simulation.stop();
  };

  $scope.step = function() {
    $scope.simulation.step();
    $scope.makeTransition = { 
      to: hideDetails($scope.simulation.stage) 
    };
    $scope.view = $scope.simulation.toView();

  
     
  };

});
