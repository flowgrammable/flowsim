'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.context
 * @description
 * # context
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Context', function(Action, Instruction, UInt, Packet) {

function Key(key, in_port, in_phy_port, tunnel_id) {
  if(_.isObject(key)) {
    _.extend(this, key);
    this.metadata = key.metadata.clone();
    this.vlan     = _.map(key.vlan, function(tag) { return tag.clone(); });
    this.mpls     = _.map(key.mpls, function(tag) { return tag.clone(); });
  } else if(_.isFinite(in_port)) {
    // Initialize input information
    this.in_port     = in_port;
    this.in_phy_port = in_phy_port;
    this.tunnel_id   = tunnel_id;
    this.metadata    = new UInt.UInt(null, null, 8);

    // Initialize array for stacks
    this.vlan = [];
    this.mpls = [];
  } else {
    throw 'Bad Key('+in_port+')';
  }
}

Key.prototype.clone = function() {
  return new Key(this);
};

Key.prototype.toView = function() {
  // FIXME
  return [];
};

function Context(ctx, packet, buffer_id, in_port, in_phy_port, tunnel_id) {
  if(_.isObject(ctx)) {
    _.extend(this, ctx);
    this.packet = ctx.packet;

    this._nxtTable = ctx._nxtTable;
    this._lstTable = ctx._lstTable;

    this.key = new Key(ctx.key);

    this.actionSet      = new Action.Set(ctx.actionSet);
    this.instructionSet = new Instruction.Set(ctx.instructionSet);
  } else if(packet && _.isNumber(buffer_id) && _.isNumber(in_port)) {
    // store a reference to the packet and buffer id
    this.packet = packet;
    this.buffer = buffer_id;
    this.meter  = -1;
    this.group  = -1;
    this.output = -1;
    this.queue  = -1;

    // initialize the first table target
    this._nxtTable = 0;
    this._lstTable = 0;

    // initialize the packet key
    this.key = new Key(null, in_port, in_phy_port, tunnel_id);

    // initialize an empty packet set
    this.actionSet      = new Action.Set();
    this.instructionSet = new Instruction.Set();
  } else {
    throw 'Bad Context('+packet+', '+buffer_id+', '+in_port+')';
  }
}

Context.prototype.clone = function() {
  return new Context(this);
};

Context.prototype.toView = function() {
  return {
    bufferId: this.buffer,
    packet: new Packet.PacketUI(this.packet),
    meter: this.meter,
    tableId: this.table(),
    key: this.key.toView(),
    actionSet: this.actionSet.toView(),
    instructionSet: this.instructionSet.toView(),
  };

};

Context.prototype.table = function(table) {
  if(table) {
    this._lstTable = table;
    this._nxtTable = table;
  } else {
    return this._nxtTable;
  }
};

Context.prototype.setInstructions = function(ins) {
  this.instructionSet = ins;
};

Context.prototype.meter = function(meter) {
  if(meter) {
    this._meter = meter;
  } else {
    return this._meter;
  }
};

Context.prototype.metadata = function(metadata) {
  if(metadata) {
    // need actual code here
    this.key.metadata = this.key.metadata;
  }
};

Context.prototype.applyActions = function(actions, dp) {
  actions.execute(dp, this);
};

Context.prototype.clearActions = function() {
  this.actionSet.clear();
};

Context.prototype.writeActions = function(actions) {
  this.actionSet.concat(actions);
};

Context.prototype.hasGoto = function() {
  return this._nxtTable !== this._lstTable;
};

Context.prototype.toView = function() {
  return {
    table: this.nxtTable,
    meter: this.meter,
    buffer: this.buffer,
    packet: Packet.createUI(this.packet),   // FIXME: normalize
    actionSet: this.actionSet.toView(),
    instructionSet: this.instructionSet.toView() 
  };
};

return {
  Key: Key,
  Context: Context
};

});
