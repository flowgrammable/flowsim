'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.simulator
 * @description
 * # simulator
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Simulation', function(Dataplane) {

function Simulation() {
  this.stage = 0;
  this.active = false;
  this.dataplane = null;
}

Simulation.prototype.stages = function() {
  return [
    'Arrival',
    'Choice',
    'Selection',
    'Execution',
    'Egress'
  ];
};

Simulation.prototype.step = function() {
  return this.stage;
};

Simulation.prototype.play = function(trace) {
  this.packets = _(packets).map(function(packet) {
    return packet.clone();
  });
  this.dataplane = new Dataplane.Dataplane(trace.device);
  this.active = true;
  this.stage = 0;
};

Simulation.prototype.stop = function() {
  this.packets   = null;
  this.dataplane = null;
  this.active    = false;
};

return {
  Simulation: Simulation
};

});
