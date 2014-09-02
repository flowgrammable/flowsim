
var formatter = require('./formatter');
var reg = require('./register');

function Arrival() {
}
exports.Arrival = Arrival;

Arrival.prototype.process = function(port, pkt) {
  return new reg.Register(port, pkt);
}

