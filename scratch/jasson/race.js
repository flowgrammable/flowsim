
// this needs to get moved to scratch/... something -jc

var connect = require('connect');
var events = require('events');
var _ = require('underscore');

var count = 10;

function Module() {
  events.EventEmitter.call(this);
  this.request = function(url) {
    console.log('request: %s', url);
    setTimeout(_.bind(function(obj) {
      console.log('tieout: %s', url);
      obj.emit('response', url);
    }, null, this), count*1000);
    count = count /10;
  }
}

Module.prototype.__proto__ = events.EventEmitter.prototype;

var module = new Module();

connect()
  .use(function(req, res, next) {
    module.on("response", function(data) {
      console.log('response: %s', data);
      res.end(data);
    });
    module.request(req.url);
  })
  .listen(3000);

