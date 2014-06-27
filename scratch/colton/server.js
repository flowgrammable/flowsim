var express = require('express');
var authware = require('./auth.js');
var environment = require('./environment.js');
var subscriber = require('./modules/subscriber');

var server = express();

environment(server);
//login and register shouldnt pass through authware
//server.use('/api/subscriber/login', subscriber.unauth);
server.use('/api/subscriber/register', subscriber.register);

server.use('/api/', authware); // auth middleware
server.use('/api/profile/:id', function(req, res){ console.log(req.params.id); });

server.listen(8000);
