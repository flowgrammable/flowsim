
/**
 * @module subscriber
 * @requires module:utils~Formatter module:utils
 */

(/** @lends module:subscriber */function(){

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
 * Create a new row in the subscriber table.
 *
 * @param {String} email - a valid email for the subscriber
 * @param {String} password - a salted password for this subscriber
 * @param {String} date - date of registration
 * @param {String} ip - client ip address used for registration
 * @param {String} token - unique id for subscriber verification
 * @param {storageCallback} - callback function to use 
 */
Storage.prototype.createSubscriber = function(email, password, date, ip, token, 
                                              callback) {
  var that = this;
  this.database.insert('subscriber', {
    email: email,
    password: password,
    reg_date: date,
    reg_ip: ip,
    verification_token: token,
    status: 'CREATED'
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'subscriber');
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
 */
Storage.prototype.getSubscriberByToken = function(token, callback) {
  this.database.select('subscriber', {
    verification_token: { '=': token }
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 0) {
        callback(msg.unknownVerificationToken());
      } else {
        callback(null, result[0]);
      }
    }
  });
};

/**
 * Retrieve a subscriber row by subscriber_id.
 *
 * @param {String} subscriber_id - subscriber id
 * @param {storageCallback} callback - 
 */
Storage.prototype.getSubscriberById = function(subscriber_id, callback) {
  this.database.select('subscriber', {
    id: { '=': subscriber_id }
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 0) {
        callback(msg.unknownVerificationToken());
      } else {
        callback(null, result[0]);
      }
    }
  });
};

/**
 * Returns a subscriber row with the specified email address.
 *
 * @param {String} email - email address
 * @param {Function} callback - standard callback
 */
Storage.prototype.getSubscriberByEmail = function(email, callback) {
  this.database.select('subscriber', {
    email: { '=': email }
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 0) {
        callback(msg.unknownEmail());
      } else {
        callback(null, result[0]);
      }
    }
  });
};

Storage.prototype.verifySubscriber = function(token, callback) {
  // update where verification_token = token
  this.database.update('subscriber', {
    status: 'ACTIVE'
  }, {
    verification_token: { '=': token },
    status:             { '=': 'CREATED' }
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 1) {
        callback(null, msg.success());
      } else {
        callback(msg.unknownVerificationToken());
      }
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
      errHandler(callback, err, 'subscriber');
    } else {
      callback(null, result);
    }
  });
};

Storage.prototype.updateSubscriberPassword = function(subscriber_id, password, 
  callback) {
  this.database.update('subscriber', {
    password: password
  }, {
    id: { '=': subscriber_id }
  }, function(err, result) {
    if(err) {
      
    } else {
      callback(null, msg.success());
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
      errHandler(callback, err, 'session');
    } else {
      callback(null, result);
    }
  });
};

Storage.prototype.getSession = function(skey, callback) {
  this.database.select('session', {
    key: { '=': skey }
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'session');
    } else {
      if(result.length === 0) {
        callback(msg.unknownSessionToken());
      } else {
        callback(null, result[0]);
      }
    }
  });
};

Storage.prototype.deleteSession = function(sid, callback) {
  this.database.delete('session', {
    id: { '=': sid }
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'session');
    } else {
      callback();
    }
  });
};

Storage.prototype.deleteStaleSession = function(time, callback) {
  this.database.delete('session', {
    timeout: {'<': time}
  }, function(err, result) {
    if(err) {
      errHandler(callback, err, 'session');
    } else {
      callback(null, result);
    }
  });
};

})();


