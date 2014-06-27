var express = require('express');
var orm = require('orm');
var environment = require('./conf/environment.js');
var routes = require('./conf/routes');
var program = require('commander');

var server = express();
server.use(express.static(__dirname + '/public'));

program.version('0.0.1')
       .option('-d, --dev','Change to developer mode')
       .parse(process.argv);
if(program.dev)
  server.set('mode','d');
environment(server);//Setting up the environment, passing server object.
routes(server);//Setting up routes for CRUD http methods.


server.listen(8000, function() {
    console.log('Listening on port 8000');
    if(program.dev) {
      console.log('--------------------------------');
      console.log('Server running in developer mode');
      console.log('--------------------------------');
    }
});

