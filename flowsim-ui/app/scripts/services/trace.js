'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.trace
 * @description
 * # trace
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Trace', function(Packet) {

function Event(ev, packet, in_port, in_phy_port, tunnel) {
  if(_.isObject(ev)) {
    _.extend(this, ev);
    this.packet = new Packet.Packet(ev.packet);
  } else {
    this.packet  = packet;

    this.in_port     = in_port ? in_port : 0;
    this.in_phy_port = in_phy_port ? in_phy_port : null;
    this.tunnel      = tunnel ? tunnel : null;
  }
}

Event.prototype.clone = function() {
  return new Event(this);
};

Event.prototype.toBase = function() {
  return {
    packet: this.packet.toBase(),
    in_port: this.in_port,
    in_phy_port: this.in_phy_port,
    tunnel: this.tunnel
  };
};

function Trace(trace) {
  if(_.isObject(trace)) {
    _.extend(this, trace);
    this.events = _(trace.events).map(function(ev) {
      return new Event(ev);
    });
  } else {
    this.name = trace;
    this.device = null;
    this.events = [];
  }
}

Trace.prototype.clone = function() {
  return new Trace(this);
};

Trace.prototype.push = function(packet, in_port, in_phy_port, tunnel) {
  this.events.push(new Event(null, packet, in_port, in_phy_port, tunnel));
};

Trace.prototype.del = function(idx) {
  this.events.splice(idx, 1);
};

Trace.prototype.toBase = function(){
  return {
    name: this.name,
    device: this.device ? {name: this.device.name} : '',
    events: _(this.events).map(function(ev){
      return ev.toBase();
    },this)
  };
};

var TraceUI              = Trace;

function create(trace) {
  return new Trace(trace);
}
function createUI(trace) {
  return new TraceUI(trace);
}

return {
  create: create,
  createUI: createUI,
  Event: Event,
  Trace: Trace
};

});
