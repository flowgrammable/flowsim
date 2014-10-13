
/**
 * @module packet
 * @requires module:utils~Formatter module:utils
 */

(/** @lends module:packet */function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');
var pg  = require('../database/pg');
/**
 * SQL result codes based on postgres definitions.
 *
 * @memberof module:subscriber~Storage
 * @readonly
 * @enum {String}
 */

var Codes = {
  /** An entry already exists in the table */
  KEY_EXISTS: '23505',
};

/**
 * The Storage object provides a simplified interface for the subscriber
 * tables in the database.
 *
 * @constructor
 * @param {module:database~Database} db - a properly constructed database
 */

function Storage(db, log) {
  this.database = db;
  this.logger   = log;
  //this.database.loadLocalModels(__dirname);
}
exports.Storage = Storage;


/**
 * @param {module:formatter~Formatter} f - a properly constructed formatter
 * @returns {Storage} returns a self refernce
 */
Storage.prototype.toFormatter = function(f) {
  f.begin('Storage');
  this.database.toFormatter(f);
  f.end();
  return this;
};

/**
 * @returns {String} returns a stringified version of storage state
 */
Storage.prototype.toString = fmt.toString;

/**
 * @callback storageCallback
 * @param {module:subscriber:msg} err - JSON wrapped error message
 * @param {module:subscriber:msg} succ - JSON wrapped res
 */

function errHandler(callback, err, table) {
  switch(err.psqlError.code) {
    case 'ECONNREFUSED':
      callback(msg.noDatabaseConnection());
      break;
    case '23505':
      if(table === 'subscriber') {
        callback(msg.existingEmail());
      } else if(table === 'packet') {
        callback(msg.existingPacket());
      } else {
        callback(msg.unknownError());
      }
      break;
    default:
      callback(msg.unknownError(err));
      break;
  }
}



/**
 * Create a new row in the packet table.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {String} packet - packet json string
 * @param {storageCallback} - callback function to use
 */
Storage.prototype.createPacket = function(subscriber_id, packet,
                                              callback) {
  var that = this;
  this.database.insert('packet', {
    subscriber_id: subscriber_id,
    name: packet.name,
    packet: packet
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'packet');
    } else {
      console.log(result);
      callback(null, result[0]);
    }
  });
};

Storage.prototype.listPackets = function(subscriber_id, callback){
  var that = this;
  this.database.select('packet', ['packet'], {
    subscriber_id: {'=' : subscriber_id }}, function(err, result){
      if(err){
        errHandler(callback, err, 'packet');
      } else {
      console.log(result);
      callback(null, result);
      }
    });
}

})();
