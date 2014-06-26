
var flogAPI = angular.module('flogAPI', []);

flogAPI.factory('flogSub', function($http) {
  return {
    login : function(email, password) {
      $http({
        method: 'POST',
        url: 'api/subscriber/login/' + email + '/' + password
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    logout : function(sessionId, token) {
      $http({
        method: 'DELETE',
        url: 'api/subscriber/logout/' + sessionId + '/' + token
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    register : function(email, password) {
      $http({
        method: 'POST',
        url: 'api/subscriber/register/' + email + '/' + password
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    verify : function(subId, token) {
      $http({
        method: 'PUT',
        url: 'api/subscriber/verify/' + subId + '/' + token
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    reset : function(email) {
      $http({
        method: 'PUT',
        url: 'api/subscriber/reset/' + email
      }).success(function(data) {
      }).error(function(data) {
      });
    }
  };
});
