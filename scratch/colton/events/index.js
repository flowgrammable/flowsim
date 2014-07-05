#!/usr/bin/env node

var url = require('url');
var connect = require('connect');

var eventEmitter = require('./event.js');
var rest = require('./rest/controller.js');
var app = connect();



app.use('/api/', rest);
 

 
app.listen(8888);