// Rest Controller
var url = require('url');
var eventEmitter = require('../event.js');

//import modules
var subscriber = require('./subscriber/controller.js');

module.exports = 
function(req, res, next){ 
		var path = url.parse(req.url).pathname.split('/');
		var data = 'test data';
        var params = path.slice(2);
        // TODO
        // check to see if path[1] is in eventEmitter.listeners 
		console.log('emitting: ', path[1]);
		eventEmitter.emit(path[1], req.method, params, req.body, next);
}
