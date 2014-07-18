var events = require('../events');
var uuid = require('node-uuid');


var url = require('url');
var msg = require('./msg');
var sub = require('./subscriber/controller');

function wrapRes(res, result) {
  console.log('sending response: ', result);
  var code = 200;
  var headers = {'Content-Type':'application/json'};
	if(result.tunnel.code && result.tunnel.headers){
		code = result.tunnel.code;
    headers = result.tunnel.headers;
	}
  delete result.tunnel;
  res.writeHead(code, headers);
  res.end(JSON.stringify(result));
}

function validateModules(userModules) {
  // Users cannot define a subscriber module
  if(userModules.subscriber)
    throw "Subscriber module overwritten";

  // Verify each module has an auth and unath section
  for(var property in userModules) {
    if(userModules.hasOwnProperty(property)) {
      if(!userModules[property].auth) {
        throw "Module: " + property + " is missing component: " + "auth"
      }
      if(!userModules[property].noauth) {
        throw "Module: " + property + " is missing component: " + "noauth"
      }
    }
  }
}

// 


module.exports = function(db, userModules) {

  var subscribers = sub();

  // Validate the supplied modules and install subscriber functions
  validateModules(userModules);
  var installedModules = userModules;
  installedModules.subscriber = subscribers.module;

  // construct and return the message handler
  return function(req, res, next) {
    var result;

    // a request must name a module and service
    var path = url.parse(req.url).pathname.split('/');
	  console.log(path);	
    if(path.length < 2) {
      wrapRes(res, msg.error({
        description: 'Service not identified'
      }));
      return;
    }

    // locate the module or return an error
    if(!installedModules[path[1]]) {
      wrapRes(res, msg.error({
        description: 'Module: ' + path[1] + ' does not exist'
      }));
    } else {
      // create unique id
      var id = uuid.v1();
      // get the session id
      // var sessId = req.session.id;
      // grab the access token if it exists
      var session = subscribers.authenticate(req.headers);
      var authFunction = installedModules[path[1]].auth[path[2]];
      var noauthFunction = installedModules[path[1]].noauth[path[2]];
      var params = path.slice(2);
      var ip = req.connection.remoteAddress;
       
      // execute the found function or error
      if(noauthFunction) {
        events.Emitter.once(id, function(result){
          wrapRes(res, result);
        });
        noauthFunction(req.method, params, req.body, ip, id);
      } else if(authFunction && session) {
        result = authFunction(session, req.method, params, req.body, ip, id);
        wrapRes(res, result);
      } else {
        wrapRes(res, msg.error({
          description: 'Service: ' + path[2] + ' does not exist'
        }));
      }
    } 
  }
}

