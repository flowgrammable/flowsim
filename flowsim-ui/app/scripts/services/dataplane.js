'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Dataplane', function(Extraction, Instruction, Action) {

function Context(ctx) { 
  if(ctx) {
    _.extend(this, ctx);
    this.packet    = ctx.packet.clone();
    this.key       = ctx.key.clone();
    this.actionSet = new Action.Set(ctx.actionSet);
  } else {
    this.stage     = 'arrival';
    this.packet    = null;           // packet data
    this.buffer_id = null;

    // All contents of a key are just a reference to actual packet
    this.key       = new Extraction.Key();
    this.actionSet = new Action.Set();  // action set carried
    this._metadata = null;        // metadata carried
    this._table    = 0;           // goto table - default is table 0
  }
}
/*
// Clear the action set
Context.prototype.clear = function() {
  this.actionSet = [];
};

// Write (append) actions to the action set
Context.prototype.write = function(actions) {
  this.actionSet.concat(actions);
};
*/

// set or get the metadata
Context.prototype.metadata = function(metadata) {
  if(metadata !== undefined && metadata !== null) {
    this._metadata = metadata;
  } else {
    return this._metadata;
  }
};

// set or get the next table id
Context.prototype.table = function(table) {
  if(table !== undefined && table !== null) {
    this._table = table;
  } else {
    return this._table;
  }
};
 
function Dataplane(trace, transCallback) {
  this.trace = trace;
  this.evId  = 0;
  this.ev    = trace.events[this.evId];
  this.stage = 'arrival';
  this.transCallback = transCallback;

  this.ctx       = null;
  this.prevTbl   = -1;
  this._imEgress = [];
  this._evEgress = [];

  this.tables = trace.switch_.tables;
  this.table  = null;
  this.flow   = null;
}

Dataplane.prototype.arrival = function(pkt, in_port) {
  this.ctx.packet      = pkt;
  this.ctx.buffer_id   = 1;
  this.ctx.key.in_port = in_port;
};

Dataplane.prototype.extraction = function() {
  Extraction.extract(this.ctx);
};

Dataplane.prototype.choice = function() {
  this.table = this.tables[this.ctx._table];
};

Dataplane.prototype.selection = function(table, key) {
  return 'Im a flow';
};

Dataplane.prototype.instruction = function(flow) {
  flow.instructions.execute(this, this.ctx);
};

Dataplane.prototype.action = function() {
  this.ctx.actionSet.execute(this, this.ctx);
};

Dataplane.prototype.egress = function() {
  if(this._imEgress.length > 0) {
    this._imEgress.splice(0, 1);
  } else if(this._evEgress.length > 0) {
    this._evEgress.splice(0, 1);
  }
};

Dataplane.prototype.output = function(port_id, group_id, ctx) {
  if(this.stage === 'instruction') {
    this._imEgress.push({
      port_id: port_id,
      group_id: group_id,
      ctx: ctx
    });
  } else if(this.stage === 'action') {
    this._evEgress.push({
      port_id: port_id,
      group_id: group_id,
      ctx: ctx
    });
  } else {
    throw 'Bad output state: '+ this.state;
  }
};

Dataplane.prototype.loop = function(ctx) {
  return this.prevTbl !== ctx._table;
};

Dataplane.prototype.hasImEgress = function() {
  return this._imEgress.length > 0;
};

Dataplane.prototype.hasEvEgress = function() {
  return this._evEgress.length > 0;
};

Dataplane.prototype.step = function() {
  // As long as there are packets to process
  if(this.evId >= this.ev.length) {
    return;
  }
  
  // Initialize the context if null
  if(this.ctx === null) {
    this.ctx = new Context();
  }

  switch(this.ctx.stage) {
    case 'arrival':
      // need to implement packet buffer mechanism
      this.arrival(this.ev.packet, this.ev.in_port);
      this.stage = 'extraction';
      this.transCallback(null, 0);
      break;
    case 'extraction':
      this.extraction();
      this.stage = 'choice';
      this.transCallback(0, 1);
      break;
    case 'choice':
      this.table = this.tables[this.ctx.tableId];
      if(stage === 'extraction') {
        this.transCallback(1, 2);
      } else {
        this.transCallback(4, 2);
      }
      this.stage = 'selection';
      break;
    case 'selection':
      this.flow = this.selection(this.table, this.ctx.key);
      this.transCallback(2, 3);
      this.tansition('instruction');
      break;
    case 'instruction':
      this.prevTbl = this.ctx.table;
      this.instruction(this.flow); 
      this.transCallback(3, 4);
      if(this.hasImEgress()) {
        this.stage = 'egress';
      } else if(this.loop(this.ctx)) {
        this.stage = 'choice';
      } else {
        this.stage ='action';
      }
      break;
    case 'action':
      this.action();
      this.transCallback(4, null);
      this.ctx = null;
      this.stage = 'egress';
      break;
    case 'egress':
      if(this.hasImEgress()) {
        this.transCallback(4, 4);
      }
      this.egress();
      if(!this.hasImEgress() && this.loop(this.ctx)) {
        this.stage = 'choice';
      }
      break;
    default:
      throw 'Bad stage: ' + this.stage;
  }

  // Advance to the next packet in the trace if nothing more 
  if(this._egress.length === 0 && this.ctx === null) {
    this.evId += 1;
  }
};

return {
  Dataplane: Dataplane
};
  
});
