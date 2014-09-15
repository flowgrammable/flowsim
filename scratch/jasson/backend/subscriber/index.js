
var subs = {};
var tokenId = 1;

module.exports = function(ctx) {
  var name = 'subscriber';
  var config = ctx.config.data;
  var server = ctx.rest;
  var tmpEngine = ctx.template;
  var mailer = ctx.mail;

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

    if(!(email in subs)) {
      subs[email] = tokenId++;

      mailer.send(email, from, 
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

