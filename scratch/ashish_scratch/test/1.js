var express = require('express');
var jwt = require('jwt-simple');
var app = express();
 
app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');


