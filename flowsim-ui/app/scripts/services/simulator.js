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
    this.dataplane.input(ev.clone());
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
