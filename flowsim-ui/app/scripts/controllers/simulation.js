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
                                          Switch, Packet) {

    $scope.names = {};
    $scope.trace = null;

    // grab the available switches
    $scope.switch_ = {
      name: '',
      names: []
    };
    fgCache.getNames('switch', function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.switch_.names = result;
      }
    });

    // grabe the available packets
    $scope.packet = {
      name: '',
      names: []
    };
    fgCache.getNames('packet', function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.packet.names = result;
      }
    });

    // allow for pushing packets to the list
    $scope.addPacket = function() {
      fgCache.get('packet', $scope.packet.name, Packet, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
          $scope.trace.push(result);
        }
      })
    };

    $scope.delPacket = function(idx) {
      $scope.trace.del(idx);
    }

    $scope.selectSwitch = function() {
      $scope.trace.switchName = $scope.switch_.name;
    }
     
    $scope.getTraces = function(callback) {
      fgCache.getNames('trace', callback);
    };

    $scope.addTrace = function(name, callback) {
      if(name in $scope.names) {
        callback('Name exists');
      } else if(name.length === 0) {
        callback('Invalid name');
      } else if(!/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(name)) {
        callback('Invalid name');
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
          fgCache.get('switch', $scope.trace.switchName, Switch, 
                      function(err, result) {
            if(err) {
              console.log(err.details);
            } else {
              $scope.switch_.name = result;
            }
          });
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
    
    $scope.play = function() {
      if($scope.active) {
        return;
      }
      $scope.active = true;
      $scope.stages[0].active = true;
    };

    $scope.stop = function() {
      if(!$scope.active) {
        return;
      }
      $scope.active = false;
    };

    $scope.pause = function() {
      if(!$scope.active) {
        return;
      }
    };

    $scope.step = function() {
      var idx;
      if(!$scope.active) {
        return;
      }
      for(idx=0; idx<$scope.stages.length; ++idx) {
        if($scope.stages[idx].active) {
          $scope.stages[idx].active = false;
          $scope.stages[(idx+1)%$scope.stages.length].active = true;
          return;
        }
      }
    };

  });
