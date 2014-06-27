var url = require('url');
var sub = require('./subscriber.js');
var msg = require('./msg.js');

function wrapRes(res, result) {
	var tunnel = {}; // result.tunnel
	//delete result.tunnel;
	tunnel['Content-Type'] = 'application/json';
	res.writeHead('200', tunnel);
	res.end(JSON.stringify(result));
}

module.exports = function(userModules,db){
  userModules.subscriber = sub.module;
  return function(req, res, next){
    var result;

    var path = url.parse(req.url).pathname.split('/');
    if(path.length < 2) {
			wrapRes(res, msg.error({
				description: 'Service not identified'
			}));
			return;
		}

  //var session = subscriber.getSession(req.headers);
  if(userModules[path[1]]){
		var params = path.slice(2);
		var noauthModule = userModules[path[1]].noauth;
    console.log(noauthModule);
    var authModule = userModules[path[1]].auth;
    if(noauthModule[path[2]]) {
			result = noauthModule[path[2]](req.method, params, req.body);
			wrapRes(res, result);
			return;
		} else if(authModule[path[2]] && session) {
			result = authModule[path[2]](session, req.method, params, req.body);
			wrapRes(res, result);
			return;
		} else {
			wrapRes( res, msg.error({
				description: 'Service not found'
			}));
			return;
		}
   } else {
		wrapRes(res, msg.error({
			description: 'Module not found'
		}));
	}

  }
}
