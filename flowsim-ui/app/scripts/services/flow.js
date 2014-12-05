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

function Flow(flow, priority, capabilities) {
  if(_.isObject(flow)) {
    _.extend(this, flow);
    this.match        = new Noproto.MatchSet(flow.match);
    this.ins          = new Instruction.Set(flow.ins);
    this.capabilities = flow.capabilities;
  } else {
    this.priority     = priority;
    this.match        = new Noproto.MatchSet();
    this.ins          = new Instruction.Set();
    this.capabilities = capabilities;
  }
}

Flow.prototype.clone = function() {
  return new Flow(this);
};

Flow.prototype.match = function(key) {
  if(this.match.match(key)) {
    return true;
  } else {
    return false;
  }
};

Flow.prototype.equal = function(flow) {
  return this.match.equal(flow.match);
};

return {
  Flow: Flow
};

});
