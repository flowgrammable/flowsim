#!/usr/bin/env node

require('./dbbs').setup();
require('./rest/subscriber/adapter.js').clearTimeouts();
var connect = require('connect');
var program = require('commander');
var html = require('./html/controller');
var rest = require('./rest/controller');
var fs = require('fs');
// var session = require('./session');



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
html.serve(app, connect, { base: htmlbase, content: require(config)});

if(program.test) {
  fs.createWriteStream('temp','utf8');
}

app
   .use(connect.json())
   .use('/api', rest(require(database), {}))
   .use(function(req, res) {
     res.writeHead('404');
     res.end('');
   })
   .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

