
var mailer = require('../mailer');

module.exports = function(cfg, server, mlr) {
  var config = cfg;
  var name = 'subscriber';
  var mailer = mlr;

  function mkMethod(path) {
    return config.root + '/' + name + '/' + path;
  }

  server.get(mkMethod('login/:user/:pwd'), function(req, res, next) {
    console.log('login: ' + req.params.user + ':' + req.params.pwd);
    res.end('login: ' + req.params.user + ':' + req.params.pwd + '\n');
  });

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
    console.log('register');
    res.end('blahasdf');
  });
  
  server.get(mkMethod('forgot/:email'), function(req, res, next) {
    console.log('forgot: ' + req.params.email);
    res.end('forgot: ' + req.params.email + '\n');
  });

};

