// Rest Controller
var url = require('url');

//import modules
var subscriber = require('./subscriber')();

function wrapRes(res, result){
	res.writeHead('200', {"Content-Type":"application/json"});
	res.end(JSON.stringify(result));
}

module.exports = function(userModules) {


	return function(req, res, next){ 
			var path = url.parse(req.url).pathname.split('/');
	        var params = path.slice(2);
	        var modules = {};
	        modules.subscriber = subscriber.module;
	        console.log(modules["subscriber"]);

	        var noauthFunction = modules[path[1]].noauth[path[2]];
	        
	        noauthFunction(req.method, params, req.body, function(result){
	        	console.log('got a result: ', result);
	        	wrapRes(res, result);
	        });

	}
}