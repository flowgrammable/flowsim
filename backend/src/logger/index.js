
/**
 * @module logger
 */

(/** @lends module:logger */function(){

var bunyan  = require('bunyan');
var fmt = require('../utils/formatter');

var name = 'logger';

function Logger(config) {
  // get our module configuration
  this.config = config[name];

}
exports.Logger = Logger;

Logger.prototype.addLog =function(name){
  this.log = bunyan.createLogger({
    name: name,
    streams: [{
      type: 'rotating-file',
      level: 'info',
      path: 'log_' + name + '.txt',
      period: this.config.period,
      count: this.config.count
    }]
  });
  return this.log;
};

})();
