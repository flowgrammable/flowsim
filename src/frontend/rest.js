
var url = require('url');

var db = {
  subscribers: [
    {
      subscriberId: 1,
      name: "Jasson Casey",
      email: "jasson.casey@gmail.com",
      password: "iluvflowg"
    }
  ],
  sessions: [
    {
      sessionId: '123456',
      accessToken: 'asdfasdf',
      subscriberId: 2
    }
  ]
}

function subscriber_lookup(email) {
  var i;
  for(i = 0; i < db.subscribers.length; ++i) {
    if(db.subscribers[i].email == email)
      return db.subscribers[i];
  }
  return {};
}

function login(req, res, next) {
  var result;
  if(!req.body.email || !req.body.password) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      error: {
      }
    }));
    return;
  }
  
  result = subscriber_lookup(req.body.email);
  if(!result.password || req.body.password != result.password) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      error: {
      }
    }));
    return;
  }
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Access-Token': 'onebigfuckingstringz'
  });
  res.end(JSON.stringify({
    success: {
    }
  }));
}

// login, login, register, verify, reset

var restModules = {
  subscriber : {
    noauth : {
      register : function(method, params, data) {
        return {
          success : {}
        };
      },
      verify : function(method, params, data) {
        return {
          success : {}
        };
      },
      reset : function(method, params, data) {
        return {
          success : {}
        };
      },
      login : function(method, params, data) {
        return {
          success : {}
        };
      }
    },
    auth : {
      logout : function(session, method, params, data) {
        return {
          success : {}
        };
      }
    }
  }
}

function lookupAccessToken(token) {
  var i;
  for(var i=0; i<db.sessions.length; ++i) {
    if(db.sessions[i].accessToken = accessToken)
      return db.session[i];
  }
  return null;
}

function wrapRes(res, result) {
  res.writeHead('200', {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(result));
}

module.exports = function(userDefinedModules) {
  return function(req, res, next) {
    var result;

    // grab the access token if it exists
    var accessToken = '';
    var session = null;
    if(req.headers['X-Access-Token']) {
      accessToken = req.headers['X-Access-Token'];
      session = lookupAccessToken(accessToken);
    }

    // respond to a bad url pathname
    var path = url.parse(req.url).pathname.split('/');
    if(path.length < 2) {
      wrapRes(res, {
        error: {
          description: 'Service not identified'
        }
      });
      return;
    }

    if(restModules[path[0]]) {
      var params = path.slice(2);
      var noauthModule = restModules[path[0]].noauth;
      var authModule = restModules[path[0]].auth;
      if(noauthModule[path[1]]) {
        result = noauthModule[path[1]](req.method, params, req.body);
        wrapRes(res, result);
        return;
      } else if(authModule[path[1]] && session) {
        result = authModule[path[1]](session, req.method, params, req.body);
        wrapRes(res, result);
        return;
      } else {
        wrapRes(res, {
          error: {
            description: 'Service not found'
          }
        });
        return
      }
    } else {
      wrapRes(res, {
        error: {
          description: 'Module not found'
        }
      });
    }
  }
}
