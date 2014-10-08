'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Subscriber
 * @description
 * # Subscriber
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Subscriber', function Subscriber($http) {

    this._xAccessToken = '';

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

    function unwrap(res, callback) {
      if(res.error) {
        callback(res.error);
      } else {
        callback(null, res.value);
      }
    }

    this.post = function(path, data, callback) {
      if(this._xAccessToken) {
        $http.post('/api/' + path, data, { 
          headers: { 'x-access-token': this._xAccessToken } 
        }).success(function(data, status) {
          unwrap(data, callback);
        }).error(function(data, status) {
          callback({
            message: 'We are having trouble contacting the server, please try' +
                     'again soon!',
            details: status + ' : ' + data
          });
        });
      } else {
        $http.post('/api/' + path, data
        ).success(function(data, status) {
          unwrap(data, callback);
        }).error(function(data, status) {
          callback({
            message: 'We are having trouble contacting the server, please try' +
                     'again soon!',
            details: status + ' : ' + data
          });
        });
      }
    };
    
    this.register = function(email, password, callback) {
      this.post('subscriber/register', {
        email: email,
        password: password
      }, callback);
    };

    this.reset = function(email, callback) {
      this.post('subscriber/reset', {
        email: email
      }, callback);
    };

    this.verify = function(token, callback) {
      this.post('subscriber/verify', {
        token: token
      }, callback);
    };

    this.login = function(email, password, callback) {
      var that = this;
      this.post('subscriber/login', {
          email: email,
          password: password
        }, function(err, result) {
          if(err) {
            callback(err);
          } else if(result['x-access-token']){
            that._xAccessToken = result['x-access-token'];
            callback(null, true);
          } else {
            callback('No access token');
          }
        });
    };
      
    this.logout = function(callback) {
      var that = this;
      this.post('subscriber/logout', {}, function(err, result) {
        that._xAccessToken = '';
        callback(err, result);
      });
    };

    this.update = function(oldPassword, password, callback) {
      this.post('subscriber/update', {
        oldPassword: oldPassword,
        newPassword: password
      }, callback);
    };

  });
