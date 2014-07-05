var eventEmitter = require('../../event.js');
var url = require('url');
var count = 10;

var subscriberHandler = function subscriberHandler(method, params, data, next)
{
  console.log('ring ring ring');
  console.log('params: ', params);
  switch(params[0]){
  	case 'register':
  		registerSub(data, next);
  		break;
    case 'login':
      break;
    case 'logout':
      break;
    case 'verify':
      break;
  	default:
      next('service doesnt exist');
  }
}
eventEmitter.on('subscriber', subscriberHandler);

function registerSub(data, next){
	console.log('called register sub');
    setTimeout(function() {
      var result = 'successfully register';
      next(result);

    }, count*1000);
    
    count = count /10;

}

