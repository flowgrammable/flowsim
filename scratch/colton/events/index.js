#!/usr/bin/env node

var url = require('url');
var connect = require('connect');

var eventEmitter = require('./event.js');
var sub = require('./sub.js');
var app = connect();



app.use('/api/', function(req, res, next)
	{ 
		var path = url.parse(req.url).pathname.split('/');
		var data = 'test data';
		eventEmitter.emit(path[1], req, res, next, data);

});
 

 
app.listen(8888);