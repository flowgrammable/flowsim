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
 
function Dataplane(trace) {
  this.trace = trace;
  this.evId  = 0;
  this.ev    = trace.events[this.evId];
  this.stage = 'arrival';

  this.ctx     = null;
  this._egress = [];

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
  this.table = this.tables[this.ctx.tableid];
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

Dataplane.prototype.egress = function(port_id, group_id, ctx) {
  this._egress.push({
    port_id: port_id,
    group_id: group_id,
    ctx: ctx
  });
};

Dataplane.prototype.step = function() {
  var oldId;

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
      break;
    case 'extraction':
      this.extraction();
      this.stage = 'choice';
      break;
    case 'choice':
      this.table = this.tables[this.ctx.tableId];
      this.stage = 'selection';
      break;
    case 'selection':
      this.flow = this.selection(this.table, this.ctx.key);
      this.stage = 'instruction';
      break;
    case 'instruction':
      oldId = this.ctx.table;
      this.instruction(this.flow); 
      if(oldId === this.ctx.table) {
        this.stage = 'action';
      } else {
        this.stage = 'choice';
      }
      break;
    case 'action':
      this.action();
      this.ctx = null;
      this.stage = 'egress';
      break;
    case 'egress':
      break;
    default:
      throw 'Bad stage: ' + this.stage;
  }
};

return {
};
  
});
