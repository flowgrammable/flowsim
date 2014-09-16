#!/usr/bin/env node

// External dependencies
var restify = require('restify');
var fs      = require('fs');
var cmdr    = require('commander');

// Internal dependent modules
var config     = require('./config');
var mailer     = require('./mailer');
var subscriber = require('./subscriber');
var template   = require('./template');
var database   = require('./database');

// Process the command line
cmdr
  .version(process.env.SERVER_VERSION)
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-h, --hostname [hostname]', 'Specify the servers hostname')
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .parse(process.argv);

// Initialze global objects
var configuration  = config(cmdr, __dirname);
var mailEngine     = mailer(configuration);
var templateEngine = template(configuration);
var db             = database(configuration);

var server = restify.createServer(configuration.getCreds())
  .use(restify.jsonp())
  .use(restify.gzipResponse())
  .use(restify.bodyParser());

// Add the subscriber module
subscriber({
  config: configuration, 
  rest: server, 
  mail: mailEngine, 
  template: templateEngine,
  database: db
});

server.listen(configuration.port(), configuration.hostname());
console.log('Started rest server @ %s', configuration.baseUrl());
  
