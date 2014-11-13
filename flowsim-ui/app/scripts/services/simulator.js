'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.simulator
 * @description
 * # simulator
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Simulation', function(Dataplane, Packet) {

function Simulation() {
  this.stage = 0;
  this.active = false;
  this.dataplane = null;
}

Simulation.prototype.stages = Dataplane.Stages;

Simulation.prototype.step = function() {
  this.stage = this.dataplane.step();
  if(this.dataplane.idle()) {
    this.stop();
  }
};

Simulation.prototype.play = function(trace) {
  this.dataplane = new Dataplane.Dataplane(trace.device);
  _(trace.events).each(function(ev) {
    console.log('b:'+ev.packet instanceof Packet.Packet);
    console.log('ui:'+ev.packet instanceof Packet.PacketUI);
    var t = ev.clone();
    console.log('input');
    console.log('pkt: '+ev.packet.name);
    console.log('ip: '+ev.in_port);
    console.log('----------------');
    console.log('input');
    //console.log('pkt: '+t.packet.name);
    console.log('ip: '+t.in_port);
    this.dataplane.input(t.clone());
  }, this);
  this.active = true;
  this.stage = 0;
};

Simulation.prototype.stop = function() {
  this.dataplane = null;
  this.active    = false;
};

return {
  Simulation: Simulation
};

});
