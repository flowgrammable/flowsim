
/**
 * @module trace
 * @requires module:utils~Formatter module:utils
 */

(/** @lends module:trace */function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');
var pg  = require('../database/pg');
/**
 * SQL result codes based on postgres definitions.
 *
 * @memberof module:trace~Storage
 * @readonly
 * @enum {String}
 */

/**
 * The Storage object provides a simplified interface for the trace
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
  console.log('err from errhandler', err);
  switch(err.psqlError.code) {
    case 'ECONNREFUSED':
      callback(msg.noDatabaseConnection());
      break;
    case '23505':
      if(table === 'subscriber') {
        callback(msg.existingEmail());
      } else if(table === 'trace') {
        callback(msg.existingTrace());
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
 * Create a new row in the trace table.
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {String} trace - trace json string
 * @param {storageCallback} - callback function to use
 */
Storage.prototype.createTrace = function(subscriber_id, trace,
                                              callback) {
  var that = this;
  var pktString = JSON.stringify(trace);
  this.database.insert('trace', {
    subscriber_id: subscriber_id,
    name: trace.name,
    trace: pktString
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'trace');
    } else {
      callback(null, result[0]);
    }
  });
};

Storage.prototype.listTraces = function(subscriber_id, callback){
  var that = this;
  var traceList = {names:[]};
  this.database.select('trace', ['name'], {
    subscriber_id: {'=' : subscriber_id }}, function(err, result){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'trace');
      } else {
        for(var i in result){
          traceList.names.push(result[i].name);
        }
        callback(null, traceList);
      }
    });
};

Storage.prototype.getTraceByName = function(subscriber_id, traceName,
  callback){
  var that = this;
  this.database.select('trace', ['trace'], {
    subscriber_id: {'=' : subscriber_id },
    name: {'=' : traceName} }, function(err, traceList){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'trace');
      } else {
        if(traceList.length === 1){
          callback(null, traceList[0].trace);
        } else {
          callback(msg.traceDoesNotExist(traceName));
        }
      }
    });
};

Storage.prototype.updateTrace = function(subscriber_id, traceName, trace,
  callback){
  var that = this;
  var pktString = JSON.stringify(trace);
  this.database.update('trace', {
    name: trace.name,
    trace: pktString
  }, {
    subscriber_id: { '=': subscriber_id },
    name: { '=' : traceName}
  }, function(err, trace){
      if(err){
        that.logger.error(err);
        errHandler(callback, err, 'trace');
      } else {
        callback(null, trace);
      }
  });
};

Storage.prototype.removeTrace = function(subscriber_id, traceName,
  callback){
    var that = this;
    this.database.delete('trace', {
      subscriber_id: { '=': subscriber_id },
      name: { '=' : traceName}
    }, function(err, result){
      if(err){
        that.logger.error(err);
        errhandler(callback, err, 'trace');
      } else {
        callback(null, result);
      }
    });
};

})();
