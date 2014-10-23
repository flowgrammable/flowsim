
/**
 * @module profile
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:profile */function(){


var fmt = require('../utils/formatter');
var msg = require('./msg');

/**
 * A controller containins the primary business logic for all profile module
 * services. It is constructed with references to necessary external services
 * and provides an interface for each of its public service offerings.
 *
 * @constructor
 * @param {Object} s          - profile storage
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
 * Given a subscriber_id and profile attempt to store the profile
 * in the database.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {Object} profile - a subscriber profile
 * @param {Function} callback - standard callback
 */
Controller.prototype.create = function(subscriber_id, profile, cb)
{
  var that = this;
  // Check if profile name already exists for subscriber
  this.storage.createProfile(subscriber_id, profile,
    function(err, profile) {
      if(err) {
        that.logger.error(err);
        cb(err);
      } else {
        cb(null, msg.success());
      }
  });
};

/**
 * Given a subscriber_id return a list of profile names that belong
 * to the subscriber.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.list = function(subscriber_id, cb){
  var that = this;
  this.storage.listProfiles(subscriber_id, function(err, profiles){
    if(err) {
      that.logger.err(err);
      cb(err);
    } else {
      cb(null, profiles);
    }
  });
};

/**
 * Given a subscriber_id and profile name attempt to retrieve the details
 * of the profile.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} profileName - name of profile to get details for
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.detail = function(subscriber_id, profileName, cb){
  var that = this;
  this.storage.getProfileByName(subscriber_id, profileName, function(err, profile){
    if(err) {
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, profile);
    }
  });
};

/**
 * Given a subscriber_id, profile name, and profile attempt to update a profile
 * with the provided profile
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} profileName - name of profile to update
 * @param {Object} profile - updated profile
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.update = function(subscriber_id, profileName, profile, cb){
  var that = this;
  this.storage.updateProfile(subscriber_id, profileName, profile,
    function(err, pkt){
      if(err){
        that.logger.error(err);
        cb(err);
      } else {
        cb(null, msg.success());
      }
  });
};

})();
