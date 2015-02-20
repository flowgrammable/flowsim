'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SimsetupCtrl
 * @description
 * # SimsetupCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SimSetupCtrl', function ($scope, $rootScope, traceList, packetList, switchList, 
  fgCache, fgStore, Trace, Switch, Packet, Regex) {
  var SimSetupCtrl = this;

  this.initState = function(){
    this.names = {};
    this.resources = {
      packetName: '',
      deviceName: '',
      packets: packetList,
      devices: switchList
    };

    this.active = {
      in_port: '',
      in_phy_port: '',
      tunnel: ''
    };

    this.trace = '';
  };
  this.initState();

  // Called when switch selected from drop down
  this.selectSwitch = function(){
    fgCache.get('switch', SimSetupCtrl.resources.deviceName, Switch,
                function(err, device) {
      if(err) {
        console.log('select switch error:', err);
      } else {
        SimSetupCtrl.setDirty();
        SimSetupCtrl.trace.device = device;
      }
    });
  };

  // attach a method to - get all the existing trace names
  this.getTraces = function(callback) {
    callback(null, traceList);
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
        SimSetupCtrl.setDirty();
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

  this.setSwitch = function(){
    fgCache.get('switch', SimSetupCtrl.resources.deviceName, Switch,
                function(err, device) {
      if(err) {
        console.log('set switch error:', err);
      } else {
        SimSetupCtrl.trace.device = device;
      }
    });
  };

  // A trace may not have a switch attached to it yet. Check to see
  // that a trace has a switch before setting it
  this.checkSwitch = function(){
    if(SimSetupCtrl.trace.device) {
      // A switch that is attached to a trace may have been deleted
      // Remove the switch from the trace if switch was deleted
      if(!_(SimSetupCtrl.resources.devices)
            .contains(SimSetupCtrl.trace.device.name)){
        SimSetupCtrl.trace.device = null;
        SimSetupCtrl.resources.deviceName = null;
      } else {
        SimSetupCtrl.resources.deviceName = SimSetupCtrl.trace.device.name;
        SimSetupCtrl.setSwitch();
      } 
    } else {
      SimSetupCtrl.resources.deviceName = null;
    }
    // Check that device still exists  
  };

  // Check that packets attached to a trace have not been deleted,
  // if they have then remove them from trace
  this.checkPackets = function(){
    fgStore.get('packet').then(function(names){
      SimSetupCtrl.resources.packets = names;
      _(SimSetupCtrl.trace.events).each(function(evt, idx){
        if(!_(SimSetupCtrl.resources.packets).contains(evt.packet.name)){
          SimSetupCtrl.trace.events.splice(idx, 1);
        }
      });
    });
  };

  // set focus on a new trace
  // Setting trace involves setting the switch and packets
  // Only set a switch 
  this.setTrace = function(name) {
    if(name === undefined) {
      SimSetupCtrl.trace = null;
    } else {
      fgCache.get('trace', name, Trace, function(err, result) {
        if(err) {
          console.log('set trace error:', err);
        } else {
          SimSetupCtrl.trace = result;
          SimSetupCtrl.checkSwitch();
          SimSetupCtrl.checkPackets();
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
    SimSetupCtrl.trace.dirty = true;
    $rootScope.$broadcast('dirtyCache');
  };

  this.setClean = function() {
    $rootScope.$broadcast('cleanCache');
  };

  });
