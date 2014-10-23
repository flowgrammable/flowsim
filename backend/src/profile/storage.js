
/**
 * @module profile
 * @requires module:utils~Formatter module:utils
 */

(/** @lends module:profile */function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');
var pg  = require('../database/pg');
/**
 * SQL result codes based on postgres definitions.
 *
 * @memberof module:profile~Storage
 * @readonly
 * @enum {String}
 */

/**
 * The Storage object provides a simplified interface for the profile
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
      } else if(table === 'profile') {
        callback(msg.existingProfile());
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
 * Create a new row in the profile table.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {String} profile - profile json string
 * @param {storageCallback} - callback function to use
 */
Storage.prototype.createProfile = function(subscriber_id, profile,
                                              callback) {
  var that = this;
  var pktString = JSON.stringify(profile);
  this.database.insert('profile', {
    subscriber_id: subscriber_id,
    name: profile.name,
    profile: pktString
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'profile');
    } else {
      callback(null, result[0]);
    }
  });
};

Storage.prototype.listProfiles = function(subscriber_id, callback){
  var that = this;
  var profileList = {names:[]};
  this.database.select('profile', ['name'], {
    subscriber_id: {'=' : subscriber_id }}, function(err, result){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'profile');
      } else {
        for(var i in result){
          profileList.names.push(result[i].name);
        }
        callback(null, profileList);
      }
    });
};

Storage.prototype.getProfileByName = function(subscriber_id, profileName,
  callback){
  var that = this;
  this.database.select('profile', ['profile'], {
    subscriber_id: {'=' : subscriber_id },
    name: {'=' : profileName} }, function(err, profileList){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'profile');
      } else {
        if(profileList.length === 1){
          callback(null, profileList[0].profile);
        } else {
          callback(msg.profileDoesNotExist(profileName));
        }
      }
    });
};

Storage.prototype.updateProfile = function(subscriber_id, profileName, profile,
  callback){
  var that = this;
  var pktString = JSON.stringify(profile);
  this.database.update('profile', {
    name: profile.name,
    profile: pktString
  }, {
    subscriber_id: { '=': subscriber_id },
    name: { '=' : profileName}
  }, function(err, profile){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'profile');
      } else {
        callback(null, profile);
      }
  });
};

})();
