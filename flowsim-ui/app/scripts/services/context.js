'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.context
 * @description
 * # context
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Context', function(Action, Instruction, UInt, Packet, Protocols) {

function Key(key, in_port, in_phy_port, tunnel_id) {
  if(_.isObject(key)) {
    _.extend(this, key);
    if(key.Internal.In_Port) {
      this.Internal.In_Port = new UInt.UInt(key.Internal.In_Port);
    }
    if(key.Internal.In_Phy_Port) {
      this.Internal.In_Phy_Port = new UInt.UInt(key.Internal.In_Phy_Port);
    }
    if(key.Internal.Tunnel_Id) {
      this.Internal.Tunnel_Id = new UInt.UInt(key.Internal.Tunnel_Id);
    }
    this.Internal.Metadata = new UInt.UInt(key.Internal.Metadata);
    this.VLAN     = _.map(key.VLAN, function(tag) { return tag.clone(); });
    this.MPLS     = _.map(key.MPLS, function(tag) { return tag.clone(); });

  } else if(_.isFinite(in_port)) {
    // Initialize input information
    this.Internal = {
      In_Port: 0,
      In_Phy_Port: 0,
      Tunnel_Id: 0,
      Metadata: 0
    };
    this.Internal.In_Port = new UInt.UInt(null, in_port, 4);

    if(in_phy_port !== undefined && in_phy_port !== null) {
      this.Internal.In_Phy_Port = new UInt.UInt(null, in_phy_port, 4);
    }
    if(tunnel_id !== undefined && tunnel_id !== null) {
      this.Internal.Tunnel_Id   = new UInt.UInt(null, tunnel_id, 4);
    }
    this.Internal.Metadata    = new UInt.UInt(null, null, 8);

    // Initialize array for stacks
  } else {
    throw 'Bad Key('+in_port+')';
  }
}

Key.prototype.clone = function() {
  return new Key(this);
};

Key.prototype.toView = function() {

  var result = [{
    name: 'Internal',
    attrs: [{
      name: 'in_port',
      value: this.Internal.In_Port.toString()
    }]
  }];

  if(this.Internal.In_Phy_Port !== undefined && this.Internal.In_Phy_Port !== null) {
    result[0].attrs.push({
      name: 'in_phy_port',
      value: this.Internal.In_Phy_Port.toString()
    });
  }

  if(this.Internal.Tunnel_Id !== undefined && this.Internal.Tunnel_Id !== null) {
    result[0].attrs.push({
      name: 'tunnel_id',
      value: this.Internal.Tunnel_Id.toString()
    });
  }
  if(this.Internal.Metadata !== undefined && this.Internal.Metadata !== null) {
    result[0].attrs.push({
      name: 'metadata',
      value: this.Internal.Metadata.toString(16)
    });
  }
  _(Protocols.Protocols).each(function(proto){
    if(_(this).has(proto.name) && proto.name !== 'Internal' &&
      !proto.pushable && !proto.popable){
      result.push({
        name: proto.name,
        attrs: _(proto.fields).map(function(field){
          return {
            name: field.name,
            // TODO rework
            value: Protocols.getField(proto.name, field.name).dispStr(this[proto.name][field.name].value)
          };
        }, this)
      });
    } else {
      // handle tags
      if(_(this).has(proto.name) && proto.name !== 'Internal'){
        _(this[proto.name]).each(function(tag){
          result.push({
            name: proto.name,
            attrs: _(proto.fields).map(function(field){
              return {
                name: field.name,
                value: Protocols.getField(proto.name, field.name).dispStr(tag[field.name].value)
              };
            }, this)
          });
        }, this);
      }
    }
  }, this);
  return result;
};

function Context(ctx, packet, buffer_id, in_port, in_phy_port, tunnel_id) {
  if(_.isObject(ctx)) {
    _.extend(this, ctx);
    this.packet = new Packet.Packet(ctx.packet);

    this._nxtTable = ctx._nxtTable;
    this._lstTable = ctx._lstTable;

    this.key = new Key(ctx.key);

    this.actionSet      = new Action.Set(ctx.actionSet);
    this.instructionSet = new Instruction.Set(ctx.instructionSet);
  } else if(packet && _.isNumber(buffer_id) && _.isNumber(in_port)) {
    // store a reference to the packet and buffer id
    this.packet = packet.clone();
    this.buffer = buffer_id;
    this.meter  = '';
    this.group  = '';
    this.output = '';
    this.queue  = '';
    this.dropPacket = false;

    // initialize the first table target
    this._nxtTable = 0;
    this._lstTable = 0;

    // initialize the packet key
    this.key = new Key(null, in_port, in_phy_port, tunnel_id);

    // initialize an empty packet set
    this.actionSet      = new Action.Set();
    this.instructionSet = new Instruction.Set();

    // Metadata

  } else {
    throw 'Bad Context('+packet+', '+buffer_id+', '+in_port+')';
  }
}

Context.prototype.clone = function() {
  return new Context(this);
};

Context.prototype.toView = function() {
  var result = {
    table: this._nxtTable,
    group: this.group,
    meter: this.meter,
    queue: this.queue.value,
    buffer: this.buffer,
    actionSet: this.actionSet.toView(),
    instructionSet: this.instructionSet.toView(),
    key: this.key.toView(),
    packet: this.packet ? this.packet.toView() : null,
    flow: this.flow ? this.flow.toView() : null
  };

  return result;
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
  this.actionSet.add(actions);
};

Context.prototype.hasGoto = function() {
  return this._nxtTable !== this._lstTable;
};

return {
  Key: Key,
  Context: Context
};

});
