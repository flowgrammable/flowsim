
module.exports = function(config) {

  var name = 'config';
  var _config = require(config[name] || process.env.CONFIG || './config.json');

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

  // Read https credentials if present
  if(_config.https) {

  // return the configured protocol
  function _protocol() {
    if(_config.https) return "https";
    else reutrn "http";
  }
   
  // return the base url
  function _baseUrl() {
    if(_config.https) {
      return _protocol() '://' + _config.localhost + ':' + _config.port;
    } else {
      return _protocol() + '://' + _config.localhost + ':' + _config.port;
    }
  }
  
  return {
    get: _get,
    data: _config,
    baseUrl: _baseUrl,
    getCreds: function() { return _creds; }
  };

};

