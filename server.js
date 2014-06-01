var restify = require('restify');
var orm = require('orm');
var environment = require('./conf/environment.js');
var routes = require('./conf/routes');

var server = restify.createServer();

environment(server);
routes(server);


server.get('/', function(req, res, next){
	console.log(req);
	res.end('my response');
	});

server.listen(8000);
