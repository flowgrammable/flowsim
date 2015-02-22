
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
  this.logger   = log.child({component: 'storage'});
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
      callback(msg.unknownError(err));
      break;
    case '23505':
      if(table === 'subscriber' || table === 'mailinglist') {
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
      that.logger.error(err);
      errHandler(callback, err, 'subscriber');
    } else {
      callback(null, result[0]);
    }
  });
};

Storage.prototype.addToMailer = function(email, date, callback) {
  var that = this;
  this.database.insert('mailinglist', {
    email: email,
    date: date
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'mailinglist');
    } else {
      callback(null, result[0]);
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
  var that = this;
  this.database.select('subscriber', {
    verification_token: { '=': token }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
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
  var that = this;
  this.database.select('subscriber', {
    id: { '=': subscriber_id }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 1) {
        callback(null, result[0]);
      } else {
        callback(msg.unknownSubscriber());
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
  var that = this;
  this.database.select('subscriber', {
    email: { '=': email }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
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

/**
 * Update status field in subscriber row to 'ACTIVE'
 *
 * @param {String} token - verification token
 * @param {Function} callback - standard callback
 *
 */

Storage.prototype.verifySubscriber = function(token, callback) {
  var that = this;
  // update where verification_token = token
  this.database.update('subscriber', {
    status: 'ACTIVE'
  }, {
    verification_token: { '=': token },
    status:             { '=': 'CREATED' }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 1) {
        callback(null, result[0]);
      } else {
        callback(msg.unknownVerificationToken());
      }
    }
  });
};

/**
 * Update status field in subscriber row to 'RESET'
 *
 * @param {String} email - subscriber email
 * @param {String} token - verification token
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.resetSubscriber = function(email, token, callback) {
  var that = this;
  this.database.update('subscriber', {
    verification_token: token,
    status: 'RESET'
  }, {
    email: { '=': email }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 1){
        callback(null, result[0]);
      } else {
        callback(msg.unknownEmail());
      }
    }
  });
};

/**
 * Given a reset token select subscriber row by token and update password field
 * with password.
 *
 * @param {String} token - reset token
 * @param {String} password - new password
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.updateSubscriberPasswordByToken = function(token, password,
  callback) {
  var that = this;
  this.database.update('subscriber', {
    password: password,
    status: 'ACTIVE'
  }, {
    verification_token: { '=': token },
    status: { '=': 'RESET' }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 1){
        callback(null, result[0]);
      } else {
        callback(msg.unknownVerificationToken());
      }
    }
  });
};

/**
 * Given a subscriber_id select subscriber row by id and update password field
 * with password.
 *
 * @param {Integer} subscriber_id - subscriber row id
 * @param {String} password - new password
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.updateSubscriberPassword = function(subscriber_id, password,
  callback) {
  var that = this;
  this.database.update('subscriber', {
    password: password
  }, {
    id: { '=': subscriber_id }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'subscriber');
    } else {
      if(result.length === 1){
        callback(null, result[0]);
      } else {
        callback(msg.unknownSubscriber());
      }
    }
  });
};

/**
 * Insert session row into database
 *
 * @param {String} skey - session key
 * @param {Integer} subId - subscriber id
 * @param {Date} tmo - session expiration date
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.createSession = function(skey, subId, tmo, callback) {
  var that = this;
  this.database.insert('session', {
    key: skey,
    subscriber_id: subId,
    timeout: tmo
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'session');
    } else {
      callback(null, result[0]);
    }
  });
};

/**
 * Retrieve a session by session key
 *
 * @param {String} skey - session key
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.getSession = function(skey, callback) {
  var that = this;
  this.database.select('session', {
    key: { '=': skey }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
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

/**
 * Delete a session by session id
 *
 * @param {Integer} sessionID - session id
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.deleteSession = function(sessionID, callback) {
  var that = this;
  this.database.delete('session', {
    id: { '=': sessionID }
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'session');
    } else {
      if(result.length === 1){
        callback(null, msg.success());
      } else {
        callback(msg.unknownSessionToken());
      }
    }
  });
};

/**
 * Delete a stale session by time
 *
 * @param {Date} time - current date
 * @param {Function} callback - standard callback
 *
 */
Storage.prototype.deleteStaleSession = function(time, callback) {
  var that = this;
  this.database.delete('session', {
    timeout: {'<': time}
  }, function(err, result) {
    if(err) {
      that.logger.error(err);
      errHandler(callback, err, 'session');
    } else {
      callback(null, msg.success());
    }
  });
};

})();
