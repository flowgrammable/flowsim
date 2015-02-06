'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.backend
 * @description
 * # backend
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Backend', function backend($http, Session) {

    var xAccessToken = '';

    function unwrap(data, callback) {
      if(data.error) {
        callback(data.error);
      } else {
        callback(null, data.value);
      }
    }

    function request(method, path, data, callback) {
      var authToken = Session.token();
      $http[method](path, data, {
        headers: { 'x-access-token': authToken }
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

    function isAuthorized(){
      return Session.isActive();
    }

    function authorize(token){
      Session.storeToken(token);
    }

    function deauthorize() {
      Session.destroy();
    }

    function get(path, data, callback){
      var authToken = Session.token();
      $http.get(path,{
        headers: { 'x-access-token': authToken }
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
      request('post', path, data, callback);
    }

    function update(path, data, callback) {
      //FIXME this looks like left-overs from a service
      request('put', path, data, callback);
    }

    function _delete(path, data, callback) {
      var authToken = Session.token();
      $http.delete(path, {
        headers: { 'x-access-token': authToken }
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
      isAuthorized: isAuthorized,
      get: get,
      post: post,
      update: update,
      _delete: _delete,
      xAccessToken: xAccessToken
    };

  });
