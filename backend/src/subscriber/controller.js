
/**
 * @module subscriber
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:subscriber */function(){

var uuid   = require('node-uuid');
var bcrypt = require('bcrypt');

var fmt = require('../utils/formatter');
var msg = require('./msg');
var stg = require('./storage');

// Default session timeout in minutes
var defTimeout = 180;

/**
 * A controller containins the primary business logic for all subuscriber module
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

function Controller(s, m, t, h, l, c, sb) {
  this.storage  = s;
  this.mailer   = m;
  this.template = t;
  this.server   = h;
  this.logger   = l.child({component: 'controller'});
  this.config   = c;
  this.slackBot = sb;
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
 * Determine if the provided token belongs to a valid active session. If
 * the session token is valid subscriber and session identifier.
 *
 * @param {String} token - session token
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.authorize = function(token, callback) {
  var that = this;
  this.storage.getSession(token, function(err, sess) {
    if(err) {
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      that.storage.getSubscriberById(sess.subscriber_id, function(err, res){
        if(err) { callback(err); }
        else { callback(null, {
          subscriber_id: sess.subscriber_id, 
          session_id: sess.id,
          organization_id: res.organization_id
          });
        }
      });
    }
  });
};

/**
 * Given an email and password attempt to login the subscriber. This involves
 * first validating the email/password, second creating a new session for the
 * subscriber, and third returning the session token needed for further
 * authenticatd requests.
 *
 * @param {String} email - email address to login
 * @param {String} pwd - password to authenticate the email
 * @param {Function} callback - standard callback
 */
Controller.prototype.login = function(email, pwd, callback) {
  var that = this;
  this.storage.getSubscriberByEmail(email, function(err, sub) {
    var token, expireTime;
    if(err) {
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      //check to see subscriber is ACTIVE before allowing login
      if(sub.status == 'ACTIVE'){
        if(bcrypt.compareSync(pwd, sub.password)) {
          token = uuid.v4();
          expireTime = new Date((new Date()).getTime() + defTimeout * 60000);
          that.storage.createSession(token, sub.id, expireTime.toISOString(),
            function(_err, session) {
              if(_err){
                that.logger.error(_err);
                delete err.detail.err;
                callback(_err);
              }
              callback(null, session.key);
            });
        } else {
          callback(msg.invalidPassword());
        }
      } else if(sub.status == 'CREATED') {
        callback(msg.subscriberNotVerified(email));
      } else if(sub.status == 'RESET'){
        callback(msg.subscriberReset(email));
      }
    }
  });
};

Controller.prototype.getProfile = function(subscriber_id, cb) {
  var that = this;
  this.storage.getProfile(subscriber_id, function(err, prof){
    if(err){
      that.logger.error(err);
      cb(err);
    } else {
      cb(null, prof);
    }
  });
};

Controller.prototype.updateProfile = function(subscriber_id, name, website, company, geography, cb)
{
  var that = this;
  this.storage.updateProfile(subscriber_id, name, website, company, geography, function(err, profile){
   if(err) {
    that.logger.error(err);
    cb(err);
   } else {
    cb(null, msg.success());
   }
  });
};

Controller.prototype.createOrganization = function(subscriber_id, organizationName, cb)
{
  var that = this;
  // Check if organization name already exists for subscriber
  this.storage.createOrganization(subscriber_id, organizationName,
    function(err, organization) {
      if(err) {
        that.logger.error(err);
        cb(err);
      } else {
        that.storage.addSubToOrg(subscriber_id, organization.id, 'ADMIN',
          function(err, res){
            if(err){
              cb(err);
            } else {
            cb(null, msg.success());
            }
          });
      }
  });
};

Controller.prototype.inviteSubToOrg = function(orgId, email, cb){
  var that = this;
  var subject, body;
  this.storage.getOrgById(orgId, function(err, res){
    if(err){
      that.logger.error(err);
      cb(err);
    } else {
      subject = 'Organization Invitation';
      body = that.template.render('organizationInvitation', {
        baseUrl: that.server.baseUrl(),
        organization: res.name,
        token: res.uuid
      });
      that.mailer.send(email, subject, body);
    }
  });
};

Controller.prototype.joinOrgFromToken = function(subscriber_id, token, cb){
  var that = this;
  this.storage.addSubToOrg(subscriber_id, token, function(err, res){
    if(err){
      cb(err);
    } else {
      cb(null, msg.success());
    }
  });
};

/**
 * Given a session id attempt to remove session entry from database.
 *
 * @param {Integer} sessionID - session entry id
 * @param {Function} callback - standard callback
 */
Controller.prototype.logout = function(sessionID, callback) {
  // if a valid session then delete the session
  var that = this;
  this.storage.deleteSession(sessionID, function(err, result){
    if(err){
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      callback(null, result);
    }
    });
};

Controller.prototype.mailerSignup = function(email, srcIP, callback) {
  var current, token, that;
  current = new Date();
  that = this;
  this.storage.addToMailer(email, current.toISOString(), function(err, sub){ 
    var subject, body;
    if(err) {
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      subject = 'Flowsim launching this winter';
      body = that.template.render('mailerSignup', {
        baseUrl: that.server.baseUrl()
      });
      that.mailer.send(email, subject, body);
      that.slackBot.postEvent('mailinglistsignup', {email: email});
      callback(null, msg.success());
    }
  });
};

Controller.prototype.register = function(email, pwd, srcIp, callback) {
  var current, token, hash, that;
  current = new Date();
  token = uuid.v4();
  hash = bcrypt.hashSync(pwd, 10);
  that = this;
  this.storage.addToMailer(email, current.toISOString(), function(err, sub){ 
    if(err) {
      console.log('mailer error: ', err);
      that.logger.error(err);
    }
  });
      this.storage.createSubscriber( email, hash, current.toISOString(), srcIp,
                                   token, function(err, sub) {
        var subject, body;
        if(err) {
          console.log('storage error:', err);
          that.logger.error(err);
          delete err.detail.err;
          callback(err);
        } else {
          subject = 'Flowsim - Verify Email Address';
          body = that.template.render('verification', {
          baseUrl: that.server.baseUrl(),
          token: token
          });
          that.storage.insertBlankProfile(sub.id);
          that.mailer.send(email, subject, body);
          if(process.env.FLOWSIM_SLACKBOT){
          that.slackBot.postEvent('registration', {email: email});
          }
          callback(null, msg.success());
        }
     });
};

/**
 * Given a token attempt the verify the subscriber associated with it.
 *
 * @param {String} token - verification token
 * @param {Function} callback - standard callback
 */
Controller.prototype.verify = function(token, callback) {
  // if the verification token is valid update
  // subscriber state
  // otherwise send an error
  var that = this;
  this.storage.verifySubscriber(token, function(err, sub){
    if(err){
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      if(sub.status == 'ACTIVE'){
        callback(null, msg.success());
      } else {
        callback(msg.unknownVerificationToken());
      }
    }
  });
};

/**
 * Given an email attempt to reset subscriber password. A reset token is
 * generated and sent in an email to subscriber.
 *
 * @param {String} email - subscriber email address
 * @param {Function} callback - standard callback
 */
Controller.prototype.forgot = function(email, callback) {
  // update the subscriber state and send and email
  // or send an error
  var token = uuid.v4();
  var that = this;
  this.storage.resetSubscriber(email, token, function(err, sub) {
    var body, subject;
    if(err) {
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      subject = 'Flowsim - Reset Password';
      body = that.template.render('reset', {
        baseUrl: that.server.baseUrl(),
        token: token
      });
      that.mailer.send(email, subject, body);
      callback(null, msg.success());
    }
  });
};

/**
 * Given a reset token and password attempt to update subscriber password.
 * The subscriber state is moved to 'ACTIVE'
 *
 * @param {String} email - subscriber email address
 * @param {Function} callback - standard callback
 */
Controller.prototype.reset = function(token, password, callback) {
  var hash = bcrypt.hashSync(password, 10);
  var that = this;
  this.storage.updateSubscriberPasswordByToken(token, hash,
    function(err, sub){
      if(err){
        that.logger.error(err);
        delete err.detail.err;
        callback(err);
      } else {
        callback(null, msg.success());
      }
  });
};

/**
 * Given a subscriber_id, old password, and new password attempt the update the
 * subscriber password with the new password. This involves first retrieving
 * the subscriber, second confirm old password is valid, and third updating
 * subscriber entry in database with the new password
 *
 * @param {Integer} subscriber_id - subscriber id
 * @param {String} oldPwd - subscriber's old password
 * @param {String} newPwd - subscriber's new password
 * @param {Function} callback - standard callback
 */

Controller.prototype.update = function(subscriber_id, oldPwd, newPwd, callback)
{
  var that = this;
  this.storage.getSubscriberById(subscriber_id, function(err, sub) {
    var hash;
    if(err) {
      that.logger.error(err);
      delete err.detail.err;
      callback(err);
    } else {
      if(bcrypt.compareSync(oldPwd, sub.password)) {
        hash = bcrypt.hashSync(newPwd, 10);
        that.storage.updateSubscriberPassword(subscriber_id, hash,
          function(err, sub){
            if(err){
              that.logger.error(err);
              delete err.detail.err;
              callback(err);
            } else {
              callback(null, msg.success());
            }
          });
      } else {
        callback(msg.invalidPassword());
      }
    }
  });
};

})();
