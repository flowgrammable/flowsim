
(function(){

var validator = require('validator');
var fmt       = require('../utils/formatter');

var msg        = require('./msg');
var controller = require('./controller');

var name = 'subscriber';

function isValidPassword(p) {
  var pat = /[0-9a-zA-Z_\(\)\^\[\]\{\}\.\$,!\+\*\\\|/:;\'"?<>`\-=~@#%&]{8,}/;
  return pat.test(p);
}

function Subscriber(config, database, mailer, template) {
  this.config = config.get(name);

  this.database = database;
  this.mailer   = mailer;
  this.template = template;
}
exports.Subscriber = Subscriber;

Subscriber.prototype.toFormatter = function(f) {
  f.begin('Subscriber');
  f.end();
};

Subscriber.prototype.toString = fmt.toString;

Subscriber.prototype.load = function(server) {

  var ctrl;

  function mkMethod(path) {
    return server.rootPath() + '/' + name + '/' + path;
  }

  // Initialize our components
  database.loadLocalModels(__dirname);
  ctrl = controller(database);

  rest.addHandler(server, 'post', mkMethod('login'), 
    function(req, res, next) {

    var dispatch = rest.responder(res);
    if(!req.body.email) {
      dispatch(msg.missingEmail());
    } else if(!validator.isEmail(req.body.email)) {
      dispatch(msg.badEmail());
    } else if(!req.body.pwd) {
      dispatch(msg.missingPwd());
    } else if(!isValidPassword(req.body.pwd)) {
      dispatch(msg.badPwd());
    }

    dispatch(msg.success({
      login: req.body.email,
      pwd: req.body.pwd
    }));
  });

};

  server.get(mkMethod('logout/:user'), function(req, res, next) {
    console.log('logout: '+ req.params.user);
    res.end('logout: '+ req.params.user + '\n');
  });

  server.get(mkMethod('verify/:token'), function(req, res, next) {
    console.log('verify: ' + req.params.token);
    res.end('verify: ' + req.params.token + '\n');
  });

  server.post(mkMethod('register'), function(req, res, next) {
    var email = req.body.email;
    var pwd = req.body.pwd;

    if(!(email in subs)) {
      subs[email] = tokenId++;

      mailer.send(email, 
        'Flowsim registration verification', 
        tmpEngine.render('verification', {
          baseUrl: mkMethod('verify'),
          token: subs[email]
       }));
      console.log('Register: %s with %i', email, subs[email]);
    } else {
      console.log('Register: %s exists', email);
    }
    res.writeHead(200, {});
    res.end('');
  });
  
  server.get(mkMethod('forgot/:email'), function(req, res, next) {
    console.log('forgot: ' + req.params.email);
    res.end('forgot: ' + req.params.email + '\n');
  });

};

})();

