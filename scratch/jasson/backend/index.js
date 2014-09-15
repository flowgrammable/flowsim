#!/usr/bin/env node

// External dependencies
var restify = require('restify');
var fs      = require('fs');
var cmdr    = require('commander');

// Internal dependent modules
var cfg        = require('./config');
var mailer     = require('./mailer');
var subscriber = require('./subscriber');
var templates  = require('./template');

// Process the command line
cmdr
  .version(process.env.SERVER_VERSION)
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-h, --hostname [hostname]', 'Specify the servers hostname')
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .parse(process.argv);

var config = cfg(cmdr);

var mlr = mailer(config);
var templateEngine = templates(config);

var server = restify.createServer(config.getCredentials())
  .use(restify.jsonp())
  .use(restify.gzipResponse())
  .use(restify.bodyParser());

subscriber(config, server, mlr, templateEngine);
  
server.listen(config.port, config.hostname);
console.log('Started rest server @ %s', config.absUrl());
  
