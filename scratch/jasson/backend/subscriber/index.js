

module.exports = function(cfg, server) {
  var config = cfg;
  var name = 'subscriber';

  function mkMethod(path) {
    return config.root + '/' + name + '/' + path;
  }

  /*
server.post('/api/subscriber/register', function(req, res, next){
   22   var email = req.body.email;
    23   var pwd = req.body.pwd;
     24 
   25   if(email in subscribers) {
      26     res.end(JSON.stringify({
         27       blorp: true
         28     }));
       29   } else {
          30     subscribers[email] = {
             31       password: pwd,
   32       state: 'INIT',
   33       token: gen()
   34     };
           35     smtpBot.(
              36       'info@compilednetworks.com',
               37       'jasson.casey@gmail.com',
                38       'test'
                 39     );
            40     res.end('blahasdf');
             41   }
 42 });
*/

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
    console.log('register');
    res.end('blahasdf');
  });
  
  server.get(mkMethod('forgot/:email'), function(req, res, next) {
    console.log('forgot: ' + req.params.email);
    res.end('forgot: ' + req.params.email + '\n');
  });

};
