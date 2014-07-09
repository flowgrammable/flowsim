#!/usr/bin/env node

var connect = require('connect');
var bodyParser = require('body-parser');

var rest = require('./rest/controller.js');
var app = connect();


app
   .use(bodyParser.json())
   .use('/api/', rest({}))
   .listen(8888);
 

 

