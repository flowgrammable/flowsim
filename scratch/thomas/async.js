
var connect = require('connect');
var events = require('events');
var _ = require('underscore');

var count = 10;
var ev = new events.EventEmitter();

ev.on("response", function(data) {
  console.log('response: %s', data);
});

function Module() {
  events.EventEmitter.call(this);
  this.request = function(res, url) {
    console.log('request: %s', url);
    setTimeout(_.bind(function(obj) {
      console.log('timeout: %s', url);
      respond(res, url);
    }, null, this), count*1000);
    count = count /10;
  }
  function respond(res, data) {
    ev.emit('response', data);
    res.end(data);
  }
}

Module.prototype.__proto__ = events.EventEmitter.prototype;

var module = new Module();

connect()
  .use(function(req, res, next) {
    module.request(res, req.url);
  })
  .listen(3000);

