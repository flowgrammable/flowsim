#!/usr/bin/env node

var restify = require('restify');
var fs = require('fs');

var config = require('./config.json');
config.https.baseUrl += ':' + 3000;
var subscriber = require('./subscriber');

var server = restify.createServer({
  key: fs.readFileSync(config.https.key),
  certificate: fs.readFileSync(config.https.cert)
})
  .use(restify.jsonp())
  .use(restify.gzipResponse())
  .use(restify.bodyParser());

subscriber(config, server);
  
server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
  

