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

                                          
//TODO - clean up this controller - move details to services
//
$scope.ctx = {
  tableId: 0,
  bufferId: 0,
  actionSet: [{
    name: 'eth0',
    value1: 'src0',
    value2: '1'
  },{
    name: 'eth1',
    value1: 'dst',
    value2: '2'
  }],
  packet: 0,
  meter : 0
};
$scope.applyActionList=[{
    name: 'eth2',
    value1: 'src0',
    value2: '1'
  },{
    name: 'eth3',
    value1: 'dst',
    value2: '2'
  }];
  $scope.writeActionSet=[{
    name: 'Group',
    value1: '2',
    value2: '3'
   }];
$scope.instrucionList = [{
  name: "Meter",
  value: 1
 
},{
  name: "Apply",
  value: 1
  
},{
  name: "Clear",
  value: 1
},{
  name: "Write",
  value: 1
},{
  name: 'Metadata',
  value: 1,
  set: [],
  list: []
},{
  name: 'Goto',
  value: 1,
  set: [],
  list: []
}];
                                         

    $scope.names = {};
    $scope.trace = null;
    $scope.simulation = null;

    // grab the available switches
    $scope.device = {
      name: '',
      names: []
    };
    fgCache.getNames('switch', function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        $scope.device.names = result;
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
      if($scope.packet.name.length) {
      fgCache.get('packet', $scope.packet.name, Packet, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
          $scope.trace.push(result);
          $scope.packet.name = '';
        }
      });
      }
    };

    $scope.delPacket = function(idx) {
      $scope.trace.del(idx);
    };

    $scope.$watch('device.name', function() {
      if($scope.trace) {
        fgCache.get('switch', $scope.device.name, Switch,
                    function(err, device) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.trace.device = device;
          }
        });
      }
    });
     
    $scope.getTraces = function(callback) {
      fgCache.getNames('trace', callback);
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
            $scope.device.name = $scope.trace.device.name || '';
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
    $scope.makeTransition =  {to:-1};
    $scope.play = function() {
      if($scope.active) {
        return;
      }
      $scope.active = true;
      $scope.stages[0].active = true;
      $scope.makeTransition ={to:0};

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
    $scope.moves =  [ {to: 1},{to: 2}, {to: 3}, {to: 4},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true}, {to: 2}, {to: 3}, {to: 4}, {to: 4, clonePacket:true}, {to: 5}];
    $scope.currStep =0;
    $scope.step = function() {
      var idx;
      if(!$scope.active) {
        return;
      }
      
      $scope.makeTransition = $scope.moves[$scope.currStep];
        //simulate execution
      if($scope.makeTransition.to === 4 &&  $scope.makeTransition.clonePacket){
        if($scope.instrucionList[0].name === "Apply" && _.size($scope.applyActionList) > 0){
          $scope.ctx.actionSet.push($scope.applyActionList.shift());
        }else{
          $scope.instrucionList.shift();
        }
        

      }
      for(idx=0; idx<$scope.stages.length; ++idx) {
        if($scope.stages[idx].active) {
          $scope.stages[idx].active = false;
          $scope.stages[$scope.moves[$scope.currStep].to].active = true;
          $scope.currStep++;
          return;
        }
      }
      $scope.simluation.step();
    };

  });
