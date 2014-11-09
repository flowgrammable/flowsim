'use strict';

angular.module('flowsimUiApp')
  .factory('Dataplane', function(Context, Utils) {


var State = {
  ARRIVAL: 'ARRIVAL',
  EXTRACTION: 'EXTRACTION',
  CHOICE: 'CHOICE',
  SELECTION: 'SELECTION',
  EXECUTION: 'EXECUTION',
  EGRESS: 'EGRESS',
  FINAL: 'FINAL'
};

function Dataplane(switch_, trace) {
  if(switch_ && trace) {
    this.ctx   = null;
    this.state = ARRIVAL;

    this.bufferIdAllocator = new Utils.Allocator();

    // state machine references
    this.table         = null;
    this.instructions  = null;
  } else {
    throw 'Bad Dataplane('+switch_+', '+trace+')';
  }
}

Dataplane.prototype.arrival = function(packet, in_port) {
  var buffer_id = new this.bufferIdAllocator();
  this.ctx      = new Context.Context(packet, buffer_id, in_port);
};

Dataplane.prototype.extraction = function() {
  Extraction.extract(this.packet, this.ctx.key);
};

Dataplane.prototype.choice = function() {
  this.table = this.switch_.tables.get(this.ctx.table());
  if(this.table === null || this.table === undefined) {
    throw 'Failed to load table: ' + this.ctx.table();
  }
};

Dataplane.prototype.selection = function() {
  // look up the flow
  var flow = this.table.lookup(this.ctx.key);
  if(flow) {
    // get a copy of the instructions
    this.instructions = flow.instructions.clone();
  }
};

Dataplane.prototype.execution = function() {
  if(this.instructions) {
    this.instructions.execute(this, this.ctx);
  }
};

Dataplane.prototype.egress = function() {
};

Dataplane.prototype.transition = function(state) {
  console.log(this.state + ' -->' + state);
  this.state = state;
};

Dataplane.prototype.step = function() {
  switch(this.state) {
    case State.ARRIVAL:
      this.arrival();
      this.transition(State.EXTRACTION);
      break;
    case State.EXTRACTION:
      this.extraction();
      this.transition(State.CHOICE);
      break;
    case State.CHOICE:
      this.choice();
      this.transition(State.SELECTION);
      break;
    case State.SELECTION:
      this.selection();
      this.transition(State.EXECUTION);
      break;
    case State.EXECUTION:
      this.execution();
      if(this.instructions) {
        this.transition(State.EXECUTION);
      } else if(this.ctx.hasGoto()) {
        this.transition(State.CHOICE);
      } else {
        this.transition(State.EGRESS);
      }
      break;
    case State.EGRESS:
      this.egress();
      if(!this.ctx.done()) {
        this.transition(State.EGRESS);
      } else {
        this.cleanup();
        this.transition(State.FINAL);
      }
      break;
    case State.FINAL:
      break;
    default:
      throw 'Bad Dataplane state: ' + this.state;
      break;
  }
};

return {
  Dataplane: Dataplane
};

});
