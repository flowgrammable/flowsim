
/**
 * @module logger
 */

(/** @lends module:logger */function(){

var bunyan  = require('bunyan');
var fmt = require('../utils/formatter');

var name = 'logger';

function Logger(config) {

  // initialize logger
  this.log = bunyan.createLogger({name: config["logger"].name});

}
exports.Logger = Logger;

Logger.prototype.addlog = function(message) {
  this.log.info(message);
};

})();

