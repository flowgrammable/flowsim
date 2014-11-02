
/**
 * @module switch
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:switch */function(){


var fmt = require('../utils/formatter');
var msg = require('./msg');

/**
 * A controller containins the primary business logic for all switch module
 * services. It is constructed with references to necessary external services
 * and provides an interface for each of its public service offerings.
 *
 * @constructor
 * @param {Object} s          - switch storage
 * @param {Object} h          - server
 * @param {Object} l          - logger engine
 */

function Controller(s, h, l) {
  this.storage  = s;
  this.server   = h;
  this.logger   = l;
}
exports.Controller = Controller;


Controller.prototype.toFormatter = function(f) {
  f.begin('Controller');
  this.storage.toFormatter(f);
  this.mailer.toFormatter(f);
  this.template.toFormatter(f);
  f.end();
};

Controller.prototype.toString = fmt.toString;

/**
 * Given a subscriber_id and switch attempt to store the switch
 * in the database.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {Object} switch - a subscriber switch
 * @param {Function} callback - standard callback
 */
Controller.prototype.create = function(subscriber_id, _switch, cb)
{
  var that = this;
  // Check if switch name already exists for subscriber
  this.storage.createSwitch(subscriber_id, _switch,
    function(err, result) {
      if(err) {
        that.logger.error(err);
        cb(err);
      } else {
        cb(null, msg.success());
      }
  });
};

/**
 * Given a subscriber_id return a list of switch names that belong
 * to the subscriber.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.list = function(subscriber_id, cb){
  var that = this;
  this.storage.listSwitches(subscriber_id, function(err, switches){
    if(err) {
      that.logger.err(err);
      cb(err);
    } else {
      cb(null, switches);
    }
  });
};

/**
 * Given a subscriber_id and switch name attempt to retrieve the details
 * of the switch.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} switchName - name of switch to get details for
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.detail = function(subscriber_id, _switchName, cb){
  var that = this;
  this.storage.getSwitchByName(subscriber_id, _switchName, function(err, result){
    if(err) {
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

/**
 * Given a subscriber_id, switch name, and switch attempt to update a switch
 * with the provided switch
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} switchName - name of switch to update
 * @param {Object} switch - updated switch
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.update = function(subscriber_id, _switchName, _switch, cb){
  var that = this;
  this.storage.updateSwitch(subscriber_id, _switchName, _switch,
    function(err, result){
      if(err){
        that.logger.error(err);
        cb(err);
      } else {
        cb(null, msg.success());
      }
  });
};

/**
 * Given a subscriber_id and switch name attempt to remove switch
 * from database
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {Function} callback - a standard callback function
 */
Controller.prototype._remove = function(subscriber_id, _switchName, cb){
  var that = this;
  this.storage.removeSwitch(subscriber_id, _switchName, function(err, result){
    if(err){
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, msg.success());
    }
  });
};

})();
