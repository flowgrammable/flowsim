'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.table
 * @description
 * # table
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Table', function table() {

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

function Table(table) {
  if(table) {
    _.extend(this, table);
    this.priorities = _.map(table.priorities, function(priority) { 
      return priority.clone();
    });
    this.miss = table.miss.clone();
  } else {
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
  Table: Table
};

});
