
var url = require('url');

var db = {
  subscribers: [
    {
      name: "Jasson Casey",
      email: "jasson.casey@gmail.com",
      password: "iluvflowg"
    }
  ],
  sessions: [],
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
  },
  flowsim : {
  }
}

module.exports = function() {
  return function(req, res, next) {
    var accessToken = '';
    if(req.headers['X-Access-Token']) {
      accessToken = req.headers['X-Access-Token'];
    }
    var path = url.parse(req.url).pathname.split('/');
    if(restModules[path[0]]) {
      var tgtModule = restModules[path[0]];
      if(tgtModule[path[1]]) {
        tgtModule[path[1]](req.method, path.slice(2), accessToken, req.body, res);
      } else {
        res.end('Object not present');
      }
    } else {
      next();
    }
  }
}
