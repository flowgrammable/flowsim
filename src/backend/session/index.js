var uuid = require('node-uuid');

var cookieParser = require('cookie-parser'); 
var cookieSession = require('cookie-session');
var sessionHandler = require('./model');



exports.handle = function(app){
    app.use(cookieParser());
    app.use(cookieSession({ secret: 'testsecret' }));
    app.use(sessionHandler()); 
}


