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
                                          Switch, Packet, Dataplane, Regex) {

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

    $scope.active = false;
    $scope.stages = [{
      name: 'Packet Arrival',
      label: 'arrival',
      active: false
    }, {
      name: 'Field Extraction',
      label: 'extraction',
      active: false
    }, {
      name: 'Table Selection',
      label: 'choice',
      active: false
    }, {
      name: 'Flow Selection',
      label: 'selection',
      active: false
    }, {
      name: 'Instruction Execution',
      label: 'execution',
      active: false
    }];
    $scope.transitions = [{
      from: null,
      to: 0,
      forward: true
    }, {
      from: 0,
      to: 1,
      forward: true
    },{
      from: 1,
      to: 2,
      forward: true
    },{
      from: 2,
      to: 3,
      forward: true
    },{
      from: 3,
      to: 4,
      forward: true
    },{
      from: 4,
      to: null,
      forward: true
    },{
      from: 4,
      to: 2,
      forward: false
    }];
    //for simulationView $watch
    $scope.makeTransition = {
        to:-1,
        clonePacket : false
        };
    $scope.play = function() {
      if($scope.active) {
        return;
      }
      $scope.active = true;
      $scope.stages[0].active = true;
      $scope.makeTransition.to =0;
      $scope.simulation = new Dataplane.Dataplane($scope.trace, 
        function(next, cur) {
        });
    };

    $scope.stop = function() {
      if(!$scope.active) {
        return;
      }
      $scope.active = false;
      $scope.simulation = null;
    };
    $scope.moves =  [ {to: 1},{to: 2}, {to: 3}, {to: 4}, {to: 2}, {to: 3}, {to: 4}, {to: 4, clonePacket:true}, {to: 5}];
    $scope.currStep =0;
    $scope.step = function() {
      var idx;
      if(!$scope.active) {
        return;
      }
        $scope.makeTransition = $scope.moves[$scope.currStep];
        $scope.currStep++;
      for(idx=0; idx<$scope.stages.length; ++idx) {
        if($scope.stages[idx].active) {
          $scope.stages[idx].active = false;
          $scope.stages[(idx+1)%$scope.stages.length].active = true;
          return;
        }
      }
      $scope.simluation.step();
    };

  });
