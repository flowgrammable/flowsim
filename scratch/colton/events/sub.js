var eventEmitter = require('./event.js');
var url = require('url');

var subscriberHandler = function subscriberHandler(req, res, next, data)
{
  var path = url.parse(req.url).pathname.split('/');
  console.log('path from subscriber', path);
  console.log('ring ring ring');
  
  switch(path[2]){
  	case 'register':
  		registerSub();
  		break;
  	default:
  }
}
eventEmitter.on('subscriber', subscriberHandler);

function registerSub(){
	console.log('called register sub');

}