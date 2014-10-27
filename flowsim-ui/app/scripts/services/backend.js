'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.backend
 * @description
 * # backend
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Backend', function backend($http) {

    this._xAccessToken = '';
    var that = this;
    function unwrap(data, callback) {
      if(data.error) {
        callback(data.error);
      } else {
        callback(null, data.value);
      }
    }

    function request(that, method, path, data, callback) {
      $http[method](path, data, {
        headers: { 'x-access-token': that._xAccessToken }
          }).success(function(data) {
              unwrap(data, callback);
            }).error(function(data, status) {
              callback({
                details: status + ' : ' + data,
            message: 'We are having trouble contacting the server, please try' +
                          'again soon!'
            });
        });

      }


    this.authorize = function(token) {
      this._xAccessToken = token;
    };

    this.deauthorize = function() {
      this._xAccessToken = '';
    };

    this.get = function(path, data, callback) {
      console.log('xaccess token: ', that);
      //request(that, 'get', path, data, callback);
      $http.get(path,{
        headers: { 'x-access-token': that._xAccessToken }
          }).success(function(data) {
             unwrap(data, callback);
           }).error(function(data, status) {
             callback({
               details: status + ' : ' + data,
               message: 'We are having trouble contacting the server, please try' +
                        'again soon!'
             });
        });
    };

    this.post = function(path, data, callback) {
      request(this, 'post', path, data, callback);
    };

    this.update = function(path, data, callback) {
      request(this, 'put', path, data, callback);
    };

    this._delete = function(path, data, callback) {
      request(this, 'delete', path, data, callback);
    };

  });
