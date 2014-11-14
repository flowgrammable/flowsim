'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.backend
 * @description
 * # backend
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Backend', function backend($http) {

    var xAccessToken = '';

    function unwrap(data, callback) {
      if(data.error) {
        callback(data.error);
      } else {
        callback(null, data.value);
      }
    }

    function request(that, method, path, data, callback) {
      $http[method](path, data, {
        headers: { 'x-access-token': xAccessToken }
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


    function authorize(token){
      xAccessToken = token;
    }

    function deauthorize() {
      xAccessToken = '';
    }

    function get(path, data, callback){
      $http.get(path,{
        headers: { 'x-access-token': xAccessToken }
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

    function post(path, data, callback) {
      //FIXME this looks like left-overs from a service
      request(this, 'post', path, data, callback);
    }

    function update(path, data, callback) {
      //FIXME this looks like left-overs from a service
      request(this, 'put', path, data, callback);
    }

    function _delete(path, data, callback) {
      $http.delete(path, {
        headers: { 'x-access-token': xAccessToken }
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

    return {
      authorize: authorize,
      deauthorize: deauthorize,
      get: get,
      post: post,
      update: update,
      _delete: _delete,
      xAccessToken: xAccessToken
    };

  });
