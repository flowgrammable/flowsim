'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Subscriber
 * @description
 * # Subscriber
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Subscriber', function Subscriber(Backend) {


    var validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validPassword = /[a-zA-Z0-9_]{8,}/;

    this.validateEmail = function(email) {
      if(!validEmail.test(email)) {
        return 'Invalid email';
      } else {
        return '';
      }
    };

    this.validatePassword = function(password) {
      if(!validPassword.test(password)) {
        return 'Invalid password';
      } else {
        return '';
      }
    };

    // Provide a mapping to the undrelying serve http methods
    this.httpGet    = Backend.get;
    this.httpPost   = Backend.post;
    this.httpUpdate = Backend.update;
    this.httpDelete = Backend._delete;

    this.register = function(email, password, callback) {
      Backend.post('/api/subscriber/register', {
        email: email,
        password: password
      }, callback);
    };

    this.reset = function(token, email, callback) {
      Backend.post('/api/subscriber/reset', {
        token: token,
        email: email
      }, callback);
    };

    this.verify = function(token, callback) {
      Backend.post('/api/subscriber/verify', {
        token: token
      }, callback);
    };

    this.login = function(email, password, callback) {
      Backend.post('/api/subscriber/login', {
          email: email,
          password: password
        }, function(err, result) {
          if(err) {
            callback(err);
          } else if(result['x-access-token']){
            Backend.authorize(result['x-access-token']);
            callback(null, true);
          } else {
            callback('No access token');
          }
        });
    };

    this.logout = function(callback) {
      Backend.post('/api/subscriber/logout', {}, function(err, result) {
        Backend.deauthorize();
        callback(err, result);
      });
    };

    this.update = function(oldPassword, password, callback) {
      Backend.post('/api/subscriber/update', {
        oldPassword: oldPassword,
        newPassword: password
      }, callback);
    };

  });
