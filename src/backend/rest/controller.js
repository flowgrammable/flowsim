
var url = require('url');
var msg = require('./msg');
var sub = require('./subscriber/controller');

function wrapRes(res, result) {
  var tunnel = result.tunnel;
  delete result.tunnel;
  tunnel[ 'Content-Type'] = 'application/json'; 
  res.writeHead('200', tunnel);
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

module.exports = function(db, userModules) {

  var subscribers = sub(db);

  // Validate the supplied modules and install subscriber functions
  validateModules(userModules);
  var installedModules = userModules;
  installedModules.subscriber = subscribers.module;

  // construct and return the message handler
  return function(req, res, next) {
    var result;

    // a request must name a module and service
    var path = url.parse(req.url).pathname.split('/');
    if(path.length < 2) {
      wrapRes(res, msg.error({
        description: 'Service not identified'
      }));
      return;
    }

    // locate the module or return an error
    if(!installedModules[path[0]]) {
      wrapRes(res, msg.error({
        description: 'Module: ' + path[0] + ' does not exist'
      }));
    } else {
    
      // grab the access token if it exists
      var session = subscribers.authenticate(req.headers);
      var authFunction = installedModules[path[0]].auth[path[1]];
      var noauthFunction = installedModules[path[0]].noauth[path[1]];
      var params = path.slice(2);

      // execute the found function or error
      if(noauthFunction) {
        result = noauthFunction(req.method, params, req.body);
        wrapRes(res, result);
      } else if(authFunction && session) {
        result = authFunction(session, req.method, params, req.body);
        wrapRes(res, result);
      } else {
        wrapRes(res, msg.error({
          description: 'Service: ' + path[1] + ' does not exist'
        }));
      }
    } 
  }
}

