#!/usr/bin/env node

var restify = require('restify');
var fs      = require('fs');
var cmdr    = require('commander');

var mailer = require('./mailer');
var subscriber = require('./subscriber');
var database = require('./database');

cmdr
  .version(process.env.SERVER_VERSION)
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .option('-h, --hostname [hostname]', 'Specify the servers hostname')
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .parse(process.argv);

var config = require(cmdr.config || process.env.CONFIG || './config.json');

config.address  = cmdr.address  || config.address;
config.hostname = cmdr.hostname || config.hostname;
config.port     = cmdr.port     || config.port;

var mlr = mailer(config.email);
var db = database(config.database);

function setHttps(c) {
  if(c !== undefined) {
    return {
      key: fs.readFileSync(c.key),
      certificate: fs.readFileSync(c.cert)
    };
  } else {
    return undefined;
  }
}

function getHttpMode() {
  if(config.https) return 'https://';
  else return 'http://';
}

var server = restify.createServer(setHttps(config.https) || {})
  .use(restify.jsonp())
  .use(restify.gzipResponse())
  .use(restify.bodyParser());

subscriber(config, server, mlr);
  
server.listen(config.port, config.address);
console.log('Started rest server @ %s%s:%s', getHttpMode(), config.address, config.port);
  
