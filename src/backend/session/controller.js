var uuid = require('node-uuid');

var cookieParser = require('cookie-parser'); 
var cookieSession = require('cookie-session');
var sessionHandler = require('./model');



exports.handle = function(app){
    app.use(cookieParser());
    app.use(cookieSession({ secret: 'testsecret' }));
    app.use(sessionHandler()); 
}


/*
    if (req.session.isNew) {
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

*/