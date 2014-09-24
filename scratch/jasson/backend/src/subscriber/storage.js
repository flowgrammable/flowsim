
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

  this.database.select('subscriber', {
    verification_token: { '=': token }
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
  this.database.update('subscriber', {
    verification_token: '',
    state: 'ACTIVE'
  }, {
    verification_token: { '=', token }
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.resetSubscriber = function(email, token, callback) {
  this.database.update('subscriber', {
    verification_token: token,
    status: 'RESET'
  }, {
    email: { '=': email }
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.updateSubscriberPassword = function(email, password, 
  callback) {
  this.database.update('subscriber', {
    password: password
  }, {
    email: { '=': email }
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.createSession = function(skey, subId, tmo, callback) {
  this.database.insert('session', {
    key: skey,
    subscriber_id: subId,
    timeout: tmo
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.getSession = function(skey, callback) {
  this.database.select('session', {
    key: { '=': skey }
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.deleteSession = function(skey, callback) {
  this.database.delete('session', {
    key: { '=': skey }
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

Storage.prototype.deleteStaleSession = function(time, callback) {
  this.database.delete('session', {
    timeout: {'<': time}
  }, function(err, result) {
    if(err) {
      callback(err);
    } else {
      callback(result);
    }
  });
};

})();


