
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
  // initialize logger
  this.log = bunyan.createLogger({
      name: this.config.name,
      streams: [{
          type: 'rotating-file',
          level: this.config.logLevel,
          path: this.config.logPath,
          period: this.config.period,
          count: this.config.count
      }]
  });

}
exports.Logger = Logger;

})();

