// Rest Controller
var eventEmitter = require('../event.js');
var url = require('url');
var subscriber = require('./subscriber/controller.js');

module.exports = 
function(req, res, next){ 
		var path = url.parse(req.url).pathname.split('/');
		var data = 'test data';
		console.log('emitting: ', path[1]);
		eventEmitter.emit(path[1], req, res, next, data);
}