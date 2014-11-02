
/**
 * @module switch
 * @requires module:utils~Formatter module:utils
 */

(/** @lends module:switch */function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');
var pg  = require('../database/pg');
/**
 * SQL result codes based on postgres definitions.
 *
 * @memberof module:switch~Storage
 * @readonly
 * @enum {String}
 */

/**
 * The Storage object provides a simplified interface for the switch
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
      } else if(table === 'switch') {
        callback(msg.existingSwitch());
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
 * Create a new row in the switch table.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {String} switch - switch json string
 * @param {storageCallback} - callback function to use
 */
Storage.prototype.createSwitch = function(subscriber_id, _switch,
                                              callback) {
  var that = this;
  var pktString = JSON.stringify(_switch);
  this.database.insert('switch', {
    subscriber_id: subscriber_id,
    name: _switch.name,
    _switch: pktString
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'switch');
    } else {
      callback(null, result[0]);
    }
  });
};

Storage.prototype.listSwitches = function(subscriber_id, callback){
  var that = this;
  var _switchList = {names:[]};
  this.database.select('switch', ['name'], {
    subscriber_id: {'=' : subscriber_id }}, function(err, result){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'switch');
      } else {
        for(var i in result){
          _switchList.names.push(result[i].name);
        }
        callback(null, _switchList);
      }
    });
};

Storage.prototype.getSwitchByName = function(subscriber_id, _switchName,
  callback){
  var that = this;
  this.database.select('switch', ['_switch'], {
    subscriber_id: {'=' : subscriber_id },
    name: {'=' : _switchName} }, function(err, _switchList){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'switch');
      } else {
        if(_switchList.length === 1){
          callback(null, _switchList[0]._switch);
        } else {
          callback(msg.switchDoesNotExist(_switchName));
        }
      }
    });
};

Storage.prototype.updateSwitch = function(subscriber_id, _switchName, _switch,
  callback){
  var that = this;
  var pktString = JSON.stringify(_switch);
  this.database.update('switch', {
    name: _switch.name,
    _switch: pktString
  }, {
    subscriber_id: { '=': subscriber_id },
    name: { '=' : _switchName}
  }, function(err, _switch){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'switch');
      } else {
        callback(null, _switch);
      }
  });
};

Storage.prototype.removeSwitch = function(subscriber_id, _switchName,
  callback){
    var that = this;
    this.database.delete('switch', {
      subscriber_id: { '=': subscriber_id },
      name: { '=' : _switchName}
    }, function(err, result){
      if(err){
        that.logger.error(err);
        errhandler(callback, err, 'switch');
      } else {
        callback(null, result);
      }
    });
};

})();
