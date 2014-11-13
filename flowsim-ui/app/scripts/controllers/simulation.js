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

    // grabe the available packets
    $scope.packet = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x03e8',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000,
  }]
};
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
    }
  };
  $scope.stop = function() {
    $scope.simulation.stop();
  };
  $scope.step = function() {
    $scope.simulation.step();
  };

   /*
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
    $scope.moves =  [ {to: 1},{to: 2}, {to: 3}, {to: 4},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true},{to: 4, clonePacket:true}, {to: 2}, {to: 3}, {to: 4}, {to: 4, clonePacket:true}, {to: 5}];
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
          $scope.applyActionList.shift();
          if($scope.applyActionList.length===0){
             $scope.instrucionList.shift();
          }
        }else if ($scope.instrucionList[0].name === "Write" && _.size($scope.writeActionSet) > 0){
          $scope.ctx.actionSet.push($scope.writeActionSet.shift());
          if($scope.writeActionSet.length===0){
             $scope.instrucionList.shift();
          }
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
    */

  });
