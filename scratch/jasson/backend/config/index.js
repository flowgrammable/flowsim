var fs = require('fs');

module.exports = function(config, cwd) {

  var name = 'config';
  var prefix = cwd + '/' + (config[name] || process.env.CONFIG || 'cfg.json');
  var _config = require(prefix);

  // establish empty credentials
  var _creds = {};              

  // Read https credentials if present
  if(_config.https) {
    _creds.key =  fs.readFileSync(_config.https.key);
    _creds.certificate = fs.readFileSync(_config.https.cert)
  }

  // Set the basic server configurations
  _config.hostname = config['hostname'] || _config.hostname || 
                      process.env.HOSTNAME || 'localhost';
  _config.port     = config['port'] || _config.port || process.env.PORT || 3000;
  
  // Provide a top-level getter
  function _get(name) {
    if(name in _config) {
      return _config[name];
    } else {
      return null;
    }
  }

  // return the configured protocol
  function _protocol() {
    if(_config.https) return "https";
    else return "http";
  }
   
  // return the base url
  function _baseUrl() {
    if(_config.https) {
      return _protocol() + '://' + _config.hostname + ':' + _config.port;
    } else {
      return _protocol() + '://' + _config.hostname + ':' + _config.port;
    }
  }
  
  return {
    get: _get,
    data: _config,
    baseUrl: _baseUrl,
    getCreds: function() { return _creds; },
    port: function() { return _config.port; },
    hostname: function() { return _config.hostname; }
  };

};

