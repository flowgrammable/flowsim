
/**
 * @module server
 * @requires module:utils~Formatter
 */

(/** @lends module:server */function(){

var fs      = require('fs');
var restify = require('restify');
var fmt     = require('../utils/formatter');

var name = 'server';

var defAddress  = '127.0.0.1';
var defHostname = 'localhost';
var defPort     = 8080;

/**
 * Constructs a restify based HTTP server.
 *
 * @constructor
 * @param {Object} config            - a server configuration object
 * @param {String} config.basedir    - the base directory of the server
 * @param {String} [config.address]  - IP address to bind
 * @param {String} [config.hostname] - hostname to bind
 * @param {String} [config.port]     - tcp port to bind
 * @param {Object} [config.https]    - https configuration object
 * @param {String} config.https.key  - location of https private key
 * @param {String} config.https.cert - location of https certificate
 */

function Server(config) {

  var dir = config.basedir;

  // Grab a configuration if present ...
  // ... otherwise supply a default configuration
  this.config = config[name] || {
    address:  defAddress,
    hostname: defHostname,
    port:     defPort
  };

  // Set default values in case where passed config is deficient
  this.config.address  = this.config.address  || defAddress;
  this.config.hostname = this.config.hostname || defHostname;
  this.config.port     = this.config.port     || defPort;
  this.config.protocol = this.config.https ? 'https' : 'http';

  // Load credential information if present
  if(this.config.https) {
    this.creds = {
      key: fs.readFileSync(dir + '/' + this.config.https.key),
      certificate: fs.readFileSync(dir + '/' + this.config.https.cert)
    };
  } else {
    this.creds = {};
  }

  // Create and configure a server instance
  this.server = restify.createServer(this.creds)
    .use(restify.jsonp())
    .use(restify.gzipResponse())
    .use(restify.bodyParser());

  if(this.config.static) {
    this.server.get(this.config.static.mount, restify.serveStatic({
        directory: dir + '/' + this.config.static.directory,
        default: 'index.html'
    }));
  }

  this.running = false;
}
exports.Server = Server;

/**
 * @callback httpCallback
 * @param {Object} req    - nodejs HTTP request object
 * @param {Object} res    - nodejs HTTP response object
 * @param {Function} next - function to envoke next http handler in chain
 */

/**
 * Registers a handler with the server to use for all HTTP reqeuests
 * where the method and path match their respective parts from the
 * request-url.
 *
 * @param {String} method        - HTTP method to catpure
 * @param {String} path          - the relative path of the handler
 * @param {httpCallback} handler - HTTP request handler to call
 * @returns {Server} a reference to the object instance
 */
Server.prototype.addHandler = function(method, path, handler) {
  switch(method) {
    case 'post':
    case 'get':
    case 'put':
    case 'delete':
      this.server[method](this.rootPath() + path, handler);
      break;
    case '*':
      this.server.use(handler);
      break;
    default:
      throw 'Bad server handler: ' + method + ' ' + path + ' ' + handler;
  }
  return this;
};

Server.prototype.addModule = function(mod) {
  mod.load(this);
  return this;
};

/**
 * Returns the base url for the running server.
 *
 * @returns {String} protocol://hostname:port
 */
Server.prototype.baseUrl = function() {
  return this.config.protocol + this.config.hostname + ':' + this.config.port;
};

/**
 * Returns the path root of the server
 *
 * @returns {String} path root of server
 */
Server.prototype.rootPath = function() {
  return this.config.root + '/';
};

/**
 * Starts the server
 *
 * @returns {Server} returns a self reference
 */
Server.prototype.run = function() {
  this.server.listen(this.config.port, this.config.hostname);
  this.running = true;
  return this;
};

/**
 * A formatter implementation for the Server.
 *
 * @param {module:utils~Formatter} f - formatter object to use
 * @returns {module:utils~Formatter} a reference to the active formatter
 */
Server.prototype.toFormatter = function(f) {
  f.begin('Server');
  f.addPair('Address', this.config.address);
  f.addPair('Hostname', this.config.hostname);
  f.addPair('Port', this.config.port);
  if(this.config.https) {
    f.addPair('Protocol', this.config.protocol);
    f.addPair('Key', this.config.https.key);
    f.addPair('Cert', this.config.https.cert);
  } else {
    f.addPair('Protocol', this.config.protocol);
  }
  f.addPair('Running', this.running);
  f.end();
  return f;
};

/**
 * Attach the basic formatter.toString funcitonality.
 *
 * @returns {String} a stringified version of the Server.
 */
Server.prototype.toString = fmt.toString;

})();

