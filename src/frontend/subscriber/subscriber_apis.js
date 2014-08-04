
var flowAPI = angular.module('flowAPI', []);

flowAPI.factory('utils', function() {
  return {
    validEmail : function(email) {
      var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(email);
    },
    validPwd : function(password) {
      var pwdRegex = /^[a-zA-Z0-9_]{8,}$/;
      return pwdRegex.test(password);
    }
  };
});

flowAPI.factory('subscriberFactory', ['$http','$rootScope', function($http, $rootScope){

  var urlBase = '/api/subscriber/';
  var subscriberFactory = {};

  subscriberFactory.register = function(data) {
    return $http.post(urlBase + 'register' , data);
  };

  subscriberFactory.reset = function(data) {
    return $http.post(urlBase + 'forgotpassword', data);
  };

  subscriberFactory.resetPass = function(data) {
    return $http.post(urlBase + 'resetpassword', data);
  };

  subscriberFactory.login = function(data){
    return $http.post(urlBase + 'login', data);
  };

  subscriberFactory.verify = function(data){
    return $http.post(urlBase + 'verify', data);
  }

  subscriberFactory.editPassword = function(fdata){
    return $http({
      method: 'POST',
      url: 'api/subscriber/editpassword',
      headers: {
        "X-Access-Token": $rootScope.token
      },
      data: JSON.stringify(fdata)
    });
  }

  subscriberFactory.logout = function(){
    return $http({
      method: 'POST',
      url: 'api/subscriber/logout',
      headers: {
        "X-Access-Token": $rootScope.token
      }
    });
  }

  return subscriberFactory;
}]);

/*
flowAPI.factory('flowsim', function(flowgrammable) {
  var flowg = flowgrammable();
  return {
    createProfile : function(body) {
      flowg.request('POST', 'profile', JSON.stringify(body));
    }
  };
});
*/
