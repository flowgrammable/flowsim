
/**
 * @module trace
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:trace */function(){


var fmt = require('../utils/formatter');
var msg = require('./msg');

/**
 * A controller containins the primary business logic for all trace module
 * services. It is constructed with references to necessary external services
 * and provides an interface for each of its public service offerings.
 *
 * @constructor
 * @param {Object} s          - trace storage
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
 * Given a subscriber_id and trace attempt to store the trace
 * in the database.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {Object} trace - a subscriber trace
 * @param {Function} callback - standard callback
 */
Controller.prototype.create = function(subscriber_id, trace, cb)
{
  var that = this;
  // Check if trace name already exists for subscriber
  this.storage.createTrace(subscriber_id, trace,
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
 * Given a subscriber_id return a list of trace names that belong
 * to the subscriber.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.list = function(subscriber_id, cb){
  var that = this;
  this.storage.listTraces(subscriber_id, function(err, traces){
    if(err) {
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, traces);
    }
  });
};

/**
 * Given a subscriber_id and trace name attempt to retrieve the details
 * of the trace.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} traceName - name of trace to get details for
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.detail = function(subscriber_id, traceName, cb){
  var that = this;
  this.storage.getTraceByName(subscriber_id, traceName, function(err, result){
    if(err) {
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

/**
 * Given a subscriber_id, trace name, and trace attempt to update a trace
 * with the provided trace
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} traceName - name of trace to update
 * @param {Object} trace - updated trace
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.update = function(subscriber_id, traceName, trace, cb){
  var that = this;
  this.storage.updateTrace(subscriber_id, traceName, trace,
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
 * Given a subscriber_id and trace name attempt to remove trace
 * from database
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {Function} callback - a standard callback function
 */
Controller.prototype._remove = function(subscriber_id, traceName, cb){
  var that = this;
  this.storage.removeTrace(subscriber_id, traceName, function(err, result){
    if(err){
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, msg.success());
    }
  });
};

})();
