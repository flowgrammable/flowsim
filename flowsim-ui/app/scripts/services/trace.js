'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.trace
 * @description
 * # trace
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Trace', function trace() {

function Trace(trace) {
  if(typeof trace === 'string') {
    this.name = trace;
    this.switch_ = null;
    this.packets = [];
  } else {
    _.extend(this, trace);
    this.packets = _.map(trace.packets, function(pkt) {
      return {
        name: pkt.name,
        packet: pkt.packet,
        in_port: pkt.in_port
      };
    });
  }
}

Trace.prototype.push = function(pkt) {
  this.packets.push({
    name: pkt.name,
    packet: pkt,
    in_port: null
  });
};

Trace.prototype.del = function(idx) {
  this.packets.splice(idx, 1);
}

Trace.prototype.clone = function() {
  return new Trace(this);
};

var TraceUI              = Trace;
TraceUI.prototype.toBase = Trace.prototype.clone;

function create(trace) {
  return new Trace(trace);
}
function createUI(trace) {
  return new TraceUI(trace);
}

return {
  create: create,
  createUI: createUI
};

});
