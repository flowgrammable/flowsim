#!/usr/bin/env node

require('./dbbs').setup();
require('./rest/subscriber/adapter.js').clearTimeouts();
var connect = require('connect');
var program = require('commander');
var html = require('./html/controller');
var rest = require('./rest/controller');
var fs = require('fs');
var profile_mod = require('./rest/profile/controller');
var packet_mod = require('./rest/packet/controller');
// var session = require('./session');
var prof = profile_mod();
var pack = packet_mod();


program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-b, --base [base html dir]', 'Specify a base dir for static files')
  .option('-d, --database [database file]', 'Specify a database file')
  .option('-t, --test', 'Run server in test mode')
  .parse(process.argv);

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

// What are these global variables for? ... globals are bad!
// Also, it appears to be providing some sort of application functionality;
// however, this is a top-level composition. There should only being argument
// handling and service initialization at this point.

var profileId = 0;
var profileList = [];

var packetId = 0;
var packetList = [];
function findById(source, id){
  for (var i = 0; i < source.length; i++){
    if(source[i].id === id){
      return i;
    }
  }
  throw "couldnt find object with id: " + id;
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
