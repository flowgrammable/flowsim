
var flogAPI = angular.module('flogAPI', []);

flowAPI.factory('utils', function() {
  return {
    
  };
});

flogAPI.factory('flogSub', function($http) {
  $scope.token = '';
  return {
    login : function(subEmail, subPwd) {
      $http({
        method: 'POST',
        url: 'api/subscriber/login'
        data: JSON.stringify({
          email: subEmail,
          password: subPwd
        })
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    logout : function() {
      $http({
        method: 'DELETE',
        url: 'api/subscriber/logout',
        headers: {
          X-access-token: $scope.token
        }
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    register : function(subEmail, subPwd) {
      $http({
        method: 'POST',
        url: 'api/subscriber/register',
        data: JSON.stringify({
          email: subEmail,
          password: subPwd
        })
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    verify : function(verificationToken) {
      $http({
        method: 'PUT',
        url: 'api/subscriber/verify',
        data: JSON.stringify({
          token: verficationToken
        })
      }).success(function(data) {
      }).error(function(data) {
      });
    },
    reset : function(subEmail) {
      $http({
        method: 'PUT',
        url: 'api/subscriber/reset',
        data: JSON.stringify({
          email: subEmail
        })
      }).success(function(data) {
      }).error(function(data) {
      });
    }
  };
});
