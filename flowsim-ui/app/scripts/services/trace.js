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
    this.events = [];
  } else {
    _.extend(this, trace);
    this.events = _.map(trace.events, function(pkt) {
      return {
        name: pkt.name,
        packet: pkt.packet,
        in_port: pkt.in_port
      };
    });
  }
}

Trace.prototype.push = function(pkt) {
  this.events.push({
    name: pkt.name,
    packet: pkt,
    in_port: 0
  });
};

Trace.prototype.del = function(idx) {
  this.events.splice(idx, 1);
};

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
