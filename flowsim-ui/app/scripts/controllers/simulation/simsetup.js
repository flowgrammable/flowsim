'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SimsetupCtrl
 * @description
 * # SimsetupCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SimSetupCtrl', function ($scope, $rootScope, fgCache, fgStore, Trace, Switch, Packet, Regex) {
  var SimSetupCtrl = this;

  this.initState = function(){
    this.names = {};
    this.resources = {
      packetName: '',
      deviceName: '',
      packets: [],
      devices: []
    };

    this.active = {
      in_port: '',
      in_phy_port: '',
      tunnel: ''
    };

    this.trace = '';
  };
  this.initState();

  fgStore.get('switch').then(function(names){
    SimSetupCtrl.resources.devices = names;
  });

  fgStore.get('packet').then(function(names){
    SimSetupCtrl.resources.packets = names;
  });

  this.selectSwitch = function(){
    fgCache.get('switch', SimSetupCtrl.resources.deviceName, Switch,
                function(err, device) {
      if(err) {
        console.log(err.details);
      } else {
        SimSetupCtrl.trace.device = device;
      }
    });
  }

  // attach a method to - get all the existing trace names
  this.getTraces = function(callback) {
    fgCache.getNames('trace', callback);
  };

    // add the selected packet to the trace
  this.addPacket = function(pkt) {
    fgCache.get('packet', pkt.packetName, Packet,
                function(err, result) {
      if(err) {
        console.log(err.details);
      } else {
        SimSetupCtrl.trace.push(result.clone(), pkt.in_port, 
            pkt.in_phy_port, pkt.tunnel);
      }
    });
  };

    // create a new trace
  this.addTrace = function(name, callback) {
    if(!Regex.Identifier.test(name)) {
      callback('Bad name');
    } else if(name in SimSetupCtrl.names) {
      callback('Name exists');
    } else {
      SimSetupCtrl.resources.deviceName = null;
      SimSetupCtrl.resources.packetName = null;
      SimSetupCtrl.trace = fgCache.create('trace', name, Trace);
      SimSetupCtrl.names[name] = true;
      SimSetupCtrl.setDirty();
      callback(null);
    }
  }; 

  // set focus on a new trace
  this.setTrace = function(name) {
    if(name === undefined) {
      SimSetupCtrl.trace = null;
    } else {
      fgCache.get('trace', name, Trace, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
          SimSetupCtrl.trace = result;
          if(SimSetupCtrl.trace.device) {
            SimSetupCtrl.resources.deviceName = SimSetupCtrl.trace.device.name;
          }
        }
      });
    }
  };

  this.delTrace = function(name){
    fgCache.destroy('trace', name);
    if(fgCache.isDirty()) {
      SimSetupCtrl.setDirty();
    } else {
      SimSetupCtrl.setClean();
    }
    delete SimSetupCtrl.names[name];
  };

  this.setDirty = function() {
    $rootScope.$broadcast('dirtyCache');
  };

  this.setClean = function() {
    $rootScope.$broadcast('cleanCache');
  };

  $scope.$on('$stateChangeStart',function(event){
  	console.log('leaving state setup');
    SimSetupCtrl.initState();
  });

  });
