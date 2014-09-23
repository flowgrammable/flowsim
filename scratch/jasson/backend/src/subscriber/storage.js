
/**
 * @module subscriber
 * @requires module:utils~Formatter module:utils
 */

(/** @lends module:subscriber */function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');

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

function Storage(db) {
  this.database = db;
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
 * @returns {undefined}
 */


/**
 * Create a new row in the subscriber table.
 *
 * @param {String} email - a valid email for the subscriber
 * @param {String} password - a salted password for this subscriber
 * @param {String} date - date of registration
 * @param {String} ip - client ip address used for registration
 * @param {String} token - unique id for subscriber verification
 * @param {storageCallback} - callback function to use 
 * @returns {Storage} returns a self reference
 */
Storage.prototype.createSubscriber = function(email, password, date, ip, token,
  callback) {

  this.database.insert('subscriber', {
    email: email,
    password: password,
    reg_date: date,
    reg_ip: ip,
    verification_token: token,
    status: 'CREATED'
  }, function(err, result) {
      if(err) {
        callback(err);
      } else {
        callback(null, result);
      }
  });
};

/**
 * Retrieve a subscriber row by the verification token.
 *
 * @param {String} token - subscriber verification token
 * @param {storageCallback} callback - 
 * @returns {Storage} returns a self reference
 */

Storage.prototype.getSubscriberByToken = function(token, callback) {

  this.database.search('subscriber', {
    verification_token: token
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

Storage.prototype.verifySubscriber = function(token, callback) {
  // update where verification_token = token
  this.database.update('subscriber', 
    [ 'verification_token', 'status' ], 
    { verification_token: token }, 
    ['', 'ACTIVE'], 
    function(err, result) {
      if(err) {
        callback(err);
      } else {
        callback(result);
      }
    });
};

Storage.prototype.resetSubscriber = function(email, token, callback) {
  this.database.update('subscriber',
    [ 'verification_token', 'status' ], 
    { email: email }, 
    [ token, 'RESET' ], 
    function(err, result) {
      if(err) {
        callback(err);
      } else {
        callback(result);
      }
    });
};

Storage.prototype.updateSubscriberPassword = function(email, password, 
  callback) {
  this.database.update('subscriber',
    [ 'password' ], 
    { email: email }, 
    [ password  ], 
    function(err, result) {
      if(err) {
        callback(err);
      } else {
        callback(result);
      }
    });
};

Storage.prototype.createSession = function(sub, skey, tmo, callback) {
  this.database.insert('session', {
    key: skey,
    subscriber_id: sub.id,
    timeout: tmo
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.getSession = function(skey, dispatch) {
  this.database.table('session').find({
    where: { key: skey } 
  }).success(function(result) {
    if(result) {
      dispatch(undefined, result);
    } else {
      dispatch(msg.sessionNotFound());
    }
  }).error(function(err) {
    dispatch(msg.unknownError(err)); // probably db connection error
  });
};

Storage.prototype.deleteSession = function(session, dispatch) {
  this.session.destroy()
    .success(function(result) {
      dispatch(msg.success());
    }).error(function(err) {
    dispatch(msg.unknownError(err));
  });
};

Storage.prototype.deleteStaleSession = function(time, dispatch) {
  this.database.table('session').destroy({
    timeout: { lt: time } 
  }).success(function(result) { 
    dispatch(msg.success(result));
  }).error  (function(err) { 
    dispatch(msg.error(err));
  });
};

})();


