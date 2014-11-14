'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.flow
 * @description
 * # flow
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Flow', function(Match, Instruction) {

function Flow(flow) {
  if(_.isObject(flow)) {
    _.extend(this, flow);
    this.match = new Match.Match(flow.match);
    this.ins   = new Instruction.Set(flow.ins);
  } else {
    this.match = new Match.Match();
    this.ins   = new Instruction.Set();
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
