'use strict';

angular.module('flowsimUiApp')
  .factory('Dataplane', function(Context, UInt, Extraction) {


var State = {
  INIT:       'INIT',
  ARRIVAL:    'ARRIVAL',
  EXTRACTION: 'EXTRACTION',
  CHOICE:     'CHOICE',
  SELECTION:  'SELECTION',
  EXECUTION:  'EXECUTION',
  GROUP:      'GROUP',
  EGRESS:     'EGRESS',
  FINAL:      'FINAL'
};

function Dataplane(device) {
  if(device) {
    this.inputQ = [];
    this.groupQ = [];

    this.datapath = device.datapath;
    this.ports    = device.ports;
    this.tables   = device.tables;
    this.groups   = device.groups;
    //this.meters   = device.meters;

    this.ctx    = null;
    this.state  = State.INIT;
  } else {
    throw 'Bad Dataplane('+device+')';
  }
}

Dataplane.prototype.input = function(ev) {
  this.inputQ.push(ev);
};

Dataplane.prototype.arrival = function(packet, in_port) {
  // Every packet is not injected into the pipeline
  // A port can have: link down, admin down, or in no_recv state
  // The dataplane could be: dropping fragments, or reassembling fragments
  if(this.ports.ingress(packet, in_port) && this.datapath.ingress(packet)) {
    var bufId = new this.datapath.bufAllocator.request();
    this.ctx  = new Context.Context(packet, bufId, in_port);
  }
};

Dataplane.prototype.extraction = function() {
  Extraction.extract(this.ctx);
};

Dataplane.prototype.choice = function() {
  this.table = this.switch_.tables.get(this.ctx.table());
  if(!_.isObject(this.table)) {
    throw 'Failed to load table: ' + this.ctx.table();
  }
};

Dataplane.prototype.selection = function() {
  var flow = this.table.select(this.ctx.key);
  if(flow) {
    this.ctx.setInstructions(flow.instructions.clone());
  }
};

Dataplane.prototype.execution = function() {
  this.ctx.instructionSet.step(this, this.ctx);
};

Dataplane.prototype.group = function() {
};

Dataplane.prototype.egress = function() {
  this.ctx.actionSet.step(this, this.ctx);
};

Dataplane.prototype.interupt = function() {
  this.immEgress.push(this.ctx.clone());
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
      if(this.groupQ.length > 0) {
        this.transition(State.GROUPS);
      } else if(this.instructionSet.empty()) {
        if(this.ctx.hasGoto()) {
          this.transition(State.CHOICE);
        } else {
          this.transition(State.EGRESS);
        }
      } else {
        this.transition(State.EXECUTION);
      }
      break;
    case State.GROUP:
      this.group();
      if(this.groupQ.length > 0) {
        this.transition(State.GROUP);
      } else if(this.instructionSet.empty()) {
        this.transition(State.EGRESS);
      } else {
        this.transition(State.EXECUTION);
      }
      break;
    case State.EGRESS:
      this.egress();
      if(this.groupQ.length > 0) {
        this.transition(State.GROUPS);
      } else if(this.ctx.actionSet.empty()) {
        this.transition(State.FINAL);
      } else {
        this.transition(State.EGRESS);
      }
      break;
    case State.FINAL:
      break;
    default:
      throw 'Bad Dataplane state: ' + this.state;
  }
};

return {
  Dataplane: Dataplane
};

});
