'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.table
 * @description
 * # table
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Table', function table(Match, Instruction, fgConstraints) {

var defaultTableStats = true;
var defaultFlowStats  = true;
var defaultMissController = false;
var defaultMissContinue = false;
var defaultMissDrop = false;
var defaultMaxEntries = 1024;

Table.Profile = function(tbl){
  if(tbl instanceof Table.Profile || (typeof tbl === 'object' && tbl !== null)){
    _.extend(this, tbl);
    this.match = new Match.Profile(tbl.match);
    this.instruction = new Instruction.Profile(tbl.instruction);
    this.miss = new Instruction.Profile(tbl.miss);
  } else {
    this.table_id = tbl;
    this.name = 'table' + this.table_id;
    this.max_entries = defaultMaxEntries;
    this.table_stats = defaultTableStats;
    this.flow_stats = defaultFlowStats;
    this.match = new Match.Profile();
    this.instruction = new Instruction.Profile();
    this.miss = new Instruction.Profile();
  }

}

Table.Profile.TIPS = {
  Match: Match.Profile.TIPS,
  Instruction: Instruction.Profile.TIPS,
  Miss: Instruction.Profile.TIPS
}

Table.Profile.TESTS = {
  name: function(n) { return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n); },
  max_entries: fgConstraints.isUInt(0,0xffffffff),
  Match: Match.Profile.TESTS,
  Instruction: Instruction.Profile.TESTS,
  Miss: Instruction.Profile.TESTS
};

function Priority(priority) {
  if(priority && typeof priority === 'number') {
    this.priority = priority;
    this.flows = [];
  }
  else if(priority) {
    _.extend(this, priority);
    _.map(priority.flows, function(flow) { return flow.clone(); });
  } else {
    this.flows = [];
  }
}

Priority.prototype.clone = function() {
  return new Priority(this);
};

Priority.prototype.add = function(flow) {
  this.flows.push(flow);
};

Priority.prototype.del = function(idx) {
  this.flows.splice(idx, 1);
};

Priority.prototype.select = function(key) {
  var i=0;
  for(i=0; i<this.flows.length; ++i) {
    if(this.flows[i].match.match(key)) {
      return this.flows[i];
    }
  }
  return null;
};

function Table(table, profile) {
  if(table instanceof Table || (typeof table === 'object' && table !== null)) {
    _.extend(this, table);
    this.capabilities.match = new Match.Profile(table.capabilities.match);
    this.capabilities.instruction = new Instruction.Profile(table.capabilities.instruction);
    this.capabilities.miss = new Instruction.Profile(table.capabilities.miss);
    this.priorities = _.map(table.priorities, function(priority) {
      return priority.clone();
    });
    this.miss = table.miss.clone();
  } else {
    this.capabilities = {
      match: profile.match,
      instruction: profile.instruction,
      miss: profile.miss
    }
    this.priorities = [];
    this.miss = null;
  }
}

Table.prototype.clone = function() {
  return new Table(this);
};

Table.prototype.add = function(priority, flow) {
  var pos = _.find(this.priorities, function(_priority) {
    return _priority.priority <= priority;
  });
  if(this.priorities[pos].priority !== priority) {
    this.priorities.splice(pos, 0, new Priority(priority));
  }
  this.priorities[pos].add(flow);
};

Table.prototype.del = function(priority, idx) {
  var pos = _.find(this.priorities, function(_priority) {
    return _priority.priority === priority;
  });
  if(pos) {
    this.priorities[pos].del(idx);
  }
};

Table.prototype.select = function(key) {
  var i, flow;
  for(i=0; i<this.priorities; ++i) {
    flow = this.priorities[i].select(key);
    if(flow) {
      return flow;
    }
  }
  return null;
};

return {
  Table: Table,
  Profile: Table.Profile
};

});
