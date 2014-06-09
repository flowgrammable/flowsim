var restify = require('restify');
var orm = require('orm');
var environment = require('./conf/environment.js');
var routes = require('./conf/routes');
var request =  require('request');//For making HTTP requests in node JS

var server = restify.createServer();

environment(server);//Setting up the environment, passing server object.
routes(server);//Setting up routes for CRUD http methods.


server.get('/', function(req, res, next){
	console.log(req);
	res.end('my response');
	});

server.listen(8000);
