
var formatter = require('./formatter');
var arrival = require('./arrival');
var extraction = require('./extraction');
var table = require('./table');
var flow = require('./flow');
var policy = require('./policy');

function Pipeline() {
  this.input = [];
  this.output = [];

  this.arrival = new arrival.Arrival();
  this.extraction = new extraction.Extraction();
  this.table_selection = new table.Selection();
  this.flow_selection = new flow.Selection();
  this.policy_exec = new policy.Execution();
}
exports.Pipeline = Pipeline;

Pipeline.prototype.step = function() {
   
}

Pipeline.prototype.run = function() {
}

