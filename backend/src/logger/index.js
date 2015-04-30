
/**
 * @module logger
 */

(/** @lends module:logger */function(){

var bunyan  = require('bunyan');
var fmt = require('../utils/formatter');

var name = 'logger';
console.log('Logger: '+process.env.FLOWSIM_LOG_LEVEL);
/**
 * Constructs a bunyan based logger.
 *
 * @param {Object} config          - server config
 * @param {String} [config.period] - period to maintain log files (1d, 1w, 1h)
 * @param {Integer} [config.count] - number of log periods to cycle
 *
 * A config with a period of 1d and count of 4 will rotate through 4 log files
 * accross 4 days.
 */

function Logger(config) {
  // get our module configuration
  this.config = config[name];
  this.logLevel = process.env.FLOWSIM_LOG_LEVEL;

}
exports.Logger = Logger;

/**
 * Creates a new log file based on bunyan.
 * Each flowsim module should have its own log file.
 * Creates a name_log.txt
 *
 * @param {String} name - name of log file
 */
Logger.prototype.addLog =function(name){
  var that = this;
  this.log = bunyan.createLogger({
    name: name,
    streams: [{
      type: 'rotating-file',
      level: that.logLevel,
      path: 'logs/' + name + '.log',
      period: this.config.period,
      count: this.config.count
    },{
      stream: process.stdout,
      level: that.logLevel
    }]
  });
  return this.log;
};
})();
