'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.flow
 * @description
 * # flow
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Flow', function(Noproto, Instruction) {

function Flow(flow, priority) {
  if(_.isObject(flow)) {
    _.extend(this, flow);
    this.match        = new Noproto.MatchSet(flow.match);
    this.ins          = new Instruction.Set(flow.ins);
  } else {
    this.priority     = priority;
    this.match        = new Noproto.MatchSet();
    this.ins          = new Instruction.Set();
  }
}

Flow.prototype.toBase = function() {
  return {
    priority: this.priority,
    ins: this.ins.toBase(),
    match: this.match
  };
};

Flow.prototype.clone = function() {
  return new Flow(this);
};

Flow.prototype.matches = function(key) {
  if(this.match.match(key)) {
    return true;
  } else {
    return false;
  }
};

Flow.prototype.assign = function(flow) {
  this.priority     = flow.priority;
  this.match        = flow.match;
  this.ins          = flow.ins;
};

Flow.prototype.equal = function(flow) {
  return this.match.equal(flow.match);
};

return {
  Flow: Flow
};

});
