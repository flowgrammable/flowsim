
/**
 * @module packet
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:packet */function(){


var fmt = require('../utils/formatter');
var msg = require('./msg');
var stg = require('./storage');

// Default session timeout in minutes
var defTimeout = 180;

/**
 * A controller containins the primary business logic for all packet module
 * services. It is constructed with references to necessary external services
 * and provides an interface for each of its public service offerings.
 *
 * @constructor
 * @param {Object} context          - wrapper of necessary services
 * @param {Object} context.database - database engine
 * @param {Object} context.mailer   - SMTP engine
 * @param {Object} context.template - template engine
 * @param {Object} context.logger   - logger engine
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
 * Given a subscriber_id,
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {String} packet - a subscriber packet
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

Controller.prototype.detail = function(subscriber_id, packetName, cb){
  var that = this;
  this.storage.getPacketByName(subscriber_id, packetName, function(err, packet){
    if(err) {
      that.logger.err(err);
      cb(err);
    } else {
      cb(null, packet);
    }
  });
};

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
