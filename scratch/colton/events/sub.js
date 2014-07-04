var eventEmitter = require('./event.js');
var url = require('url');
var count = 10;
var subscriberHandler = function subscriberHandler(req, res, next, data)
{
  var path = url.parse(req.url).pathname.split('/');
  console.log('path from subscriber', path);
  console.log('ring ring ring');
  
  switch(path[2]){
  	case 'register':
  		registerSub(req, res);
  		break;
  	default:
  }
}
eventEmitter.on('subscriber', subscriberHandler);

function registerSub(req, res){
	console.log('called register sub');
    setTimeout(function() {
      res.end(req.url);

    }, count*1000);
    
    count = count /10;

}