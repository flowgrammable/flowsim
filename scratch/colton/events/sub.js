var eventEmitter = require('./event.js');

var ringBell = function ringBell(req, res, next)
{
  console.log('ring ring ring');
  console.log(req);
}
eventEmitter.on('subscriber', ringBell);