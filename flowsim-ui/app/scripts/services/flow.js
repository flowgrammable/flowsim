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
  if(flow) {
    _.extend(this, flow);
    // all the other flow stuff can go here
    this.match = new Match.Match(flow.match);
    this.ins   = new Instruction.Set(flow.ins);
  } else {
    this.match = new Match.Match();
    // all the other flow stuff can go here
    this.ins   = new Instruction.Set();
  }
}

Flow.prototype.clone = function() {
  return new Flow(this);
};

Flow.prototype.select = function(key) {
  if(this.match.match(key)) {
    return this.ins;
  } else {
    return null;
  }
};

return {
  Flow: Flow
};
  
});
