
/**
 * @module packet
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:packet */function(){


var fmt = require('../utils/formatter');
var msg = require('./msg');

/**
 * A controller containins the primary business logic for all packet module
 * services. It is constructed with references to necessary external services
 * and provides an interface for each of its public service offerings.
 *
 * @constructor
 * @param {Object} s          - packet storage
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
 * Given a subscriber_id and packet attempt to store the packet
 * in the database.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {Object} packet - a subscriber packet
 * @param {Function} callback - standard callback
 */
Controller.prototype.create = function(subscriber_id, packet, cb)
{
  var that = this;
  // Check if packet name already exists for subscriber
  this.storage.createPacket(subscriber_id, packet,
    function(err, packet) {
      if(err) {
        that.logger.error(err);
        cb(err);
      } else {
        cb(null, msg.success());
      }
  });
};

/**
 * Given a subscriber_id return a list of packet names that belong
 * to the subscriber.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.list = function(subscriber_id, cb){
  var that = this;
  this.storage.listPackets(subscriber_id, function(err, packets){
    if(err) {
      that.logger.err(err);
      cb(err);
    } else {
      cb(null, packets);
    }
  });
};

/**
 * Given a subscriber_id and packet name attempt to retrieve the details
 * of the packet.
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} packetName - name of packet to get details for
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.detail = function(subscriber_id, packetName, cb){
  var that = this;
  this.storage.getPacketByName(subscriber_id, packetName, function(err, packet){
    if(err) {
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, packet);
    }
  });
};

/**
 * Given a subscriber_id, packet name, and packet attempt to update a packet
 * with the provided packet
 *
 * @param {Integer} subscriber_id - id of subscriber
 * @param {String} packetName - name of packet to update
 * @param {Object} packet - updated packet
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.update = function(subscriber_id, packetName, packet, cb){
  var that = this;
  this.storage.updatePacket(subscriber_id, packetName, packet,
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
