var uuid = require('node-uuid');
var sessionAdapter = require('./adapter');
var cookieParser = require('cookie-parser'); 
var cookieSession = require('cookie-session');

exports.handle = function(app){
    app.use(cookieParser());
    app.use(function(req, res, next){
    	console.log('before cookie session: ', req.session); 
    	next();
    });
    app.use(cookieSession({ secret: 'testsecret' }));
    app.use(function(req, res, next){
    	console.log('after cookie session: ', req.session); 
    	next();
    });
    app.use(function(req, res, next){
    if (req.session.isNew == true) {
      req.session.id = uuid.v4();
      sessionAdapter.insertSession(req.session.id, req.connection.remoteAddress,
        function(result){ 
          if (result.error) console.log('error adding session to database');
          else console.log('session has been added to database');
          console.log(result); 
        });
      res.end('new session');
    }
    else res.end('existing session with id: '+req.session.id);
  }); 
}
