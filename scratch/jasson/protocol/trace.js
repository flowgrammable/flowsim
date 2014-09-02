
var formatter = require('./formatter');

function Event() {
  this.time = null;
  this.switchid = null;
  this.port = null;
  this.packet = null;
}
exports.Event = Event;

Event.prototype.toFormatter = function(f) {
  f.begin('Event');
    this.time.toFormatter(f);
    f.addPair('Switch Id', this.switchid);
    f.addPair('In Port', this.port);
    this.packet.toFormatter(f);
  f.end();
}

Event.prototype.toString = function() {
  var f = new formatter.Formatter();
  var result = this.toFormatter(f);
  delete f;
  return result;
}

function Trace() {
  this.queue = [];
}
exports.Trace = Trace;

Trace.prototype.toFormatter = function(f) {
  f.begin('Trace');
  for(var i=0; i<this.queue.length; ++i) {
    this.queue[i].toFormatter(f);
  }
  f.end();
}

Trace.prototype.toString = function() {
  var f = new formatter.Formatter();
  var result = this.toFormatter(f);
  delete f;
  return result;
}

Trace.prototype.add = function(e, pos) {
  this.queue.insert(pos, e);
}

Trace.prototype.del = function(pos) {
  this.queue.splice(pos, 1);
}
