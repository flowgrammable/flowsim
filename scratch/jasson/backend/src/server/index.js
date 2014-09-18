
(function(){

var fs  = require('fs');
var fmt = require('../utils/formatter');

var name = 'server';

var defAddress  = '127.0.0.1';
var defHostname = 'localhost';
var defPort     = 8080;

function Server(config) {

  // Grab a configuration if present ...
  // ... otherwise supply a default configuration
  this.config = config.get(name) || {
    address:  defAddress,
    hostname: defHostname,
    port:     defPort
  };

  // Set default values in case where passed config is deficient
  this.config.address  = this.config.address  || defAddress;
  this.config.hostname = this.config.hostname || defHostname;
  this.config.port     = this.config.port     || defPort;

  // Load credential information if present
  if(this.config.https) {
    this.creds = {
      key: fs.readFileSync(_config.https.key),
      certificate: fs.readFileSync(_config.https.cert)
    };
  } else {
    this.creds = {};
  }

  // Create and configure a server instance
  this.server = restify.createServer(this.creds)
    .use(restify.jsonp())
    .use(restify.gzipResponse())
    .use(restify.bodyParser());

  this.running = false;
}
exports.Server = Server;

Server.prototype.addHandler = function(method, path, handler) {
  switch(method) {
    case 'post':
    case 'get':
    case 'put':
    case 'delete':
      this.server[method](path, handler);
      break;
    default:
      throw 'Bad server handler: ' + method + ' ' + path + ' ' + handler;
      break;
  }
};

Server.prototype.run = function() {
  this.server.listen(this.config.port, this.config.);
  this.running = true;
}

// Provide some basic pretty printing to the formatter
Server.prototype.toFormatter = function(f) {
  f.begin('Server');
  f.addPair('Address', this.config.address);
  f.addPair('Hostname', this.config.hostname);
  f.addPair('Port', this.config.port);
  if(this.config.https) {
    f.addPair('Protocol', 'HTTPS');
    f.addPair('Key', this.config.https.key);
    f.addPair('Cert', this.config.https.cert);
  } else {
    f.addPair('Protocol', 'HTTP');
  }
  f.addPair('Running', this.running);
  f.end();
  return f;
};

// The default formatter toString can be used
Server.prototype.toString = fmt.toString;

function Delegate(res) {
  var response = res;
  return function(result) {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(result));
  };
}
exports.Delegate = Delegate;

})();

