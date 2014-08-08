#!/usr/bin/env node

// First obtain library modules
var connect = require('connect');
var program = require('commander');
var fs      = require('fs');

// Second obtain local modules
var html = require('./html/controller');
var rest = require('./rest/controller');

var profile_mod = require('./rest/profile/controller');
var packet_mod = require('./rest/packet/controller');

// Something about this seems wrong .. why do we not need references to ddbs or 
// adapter here? If we are trying to perform code initialization then it belongs
// in some initialization code block for the associated module or the modules
// initializaiton.

require('./dbbs').setup();
require('./rest/subscriber/adapter.js').clearTimeouts();

// var session = require('./session');

// again ... what is going on here ... should this a global action?
var prof = profile_mod();
var pack = packet_mod();

// Build the comand line parsing help strings
program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-b, --base [base html dir]', 'Specify a base dir for static files')
  .option('-d, --database [database file]', 'Specify a database file')
  .option('-t, --test', 'Run server in test mode')
  .parse(process.argv);

// Set some basic global configuration parameters based on
// what was passed as input or set as an environment variable or
// a hard coded default value.

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';
var config = program.config || process.env.CONFIG || './config';
var htmlbase = program.base || process.env.BASE || __dirname;
var database = program.database || process.env.DATABASE || './dbbs';

var app = connect();

// Note - it would be nice if this could be refactored to a connect functor
html.serve(app, connect, { base: htmlbase, content: require(config)});

if(program.test) {
  fs.createWriteStream('temp','utf8');
}

app
  .use(connect.json())
  .use('/api', 
       rest(require(database), {profile: prof.module, packet: pack.module})
      )
  // We should refactor this into a generic resource not found handler.
  // Definitions should be really be in this file (index.js)
  .use(function(req, res) {
    res.writeHead('404');
    res.end('');
  })
  .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

