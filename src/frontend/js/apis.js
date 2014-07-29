
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

flowAPI.factory('flowgrammable', function($http, $rootScope) {
  var accessToken = '';
  return {
    login : function(subEmail, subPwd) {
      $http({
        method: 'POST',
        url: 'api/subscriber/login',
        data: JSON.stringify({
          email: subEmail,
          password: subPwd
        })
      }).success(function(data, status, headers, config) {
        accessToken = data.value;
        if(data.value ) {
          $rootScope.$broadcast("authenticated", {
            
          });
        } else if(data.error.type == 'subscriberNotActive') {
          $rootScope.$broadcast("subscriberNotActive");
        } else if(data.error.type == 'subscriberNotFound'){
					$rootScope.$broadcast("subscriberNotFound");
				}
      }).error(function(data) {
        $rootScope.$broadcast("loginFailure");
      });
    },
    logout : function() {
      $http({
        method: 'DELETE',
        url: 'api/subscriber/logout',
        headers: {
          "X-Access-Token": accessToken
        }
      }).success(function(data) {
        $rootScope.$broadcast("unauthenticated");
      }).error(function(data) {
      });
    },
    editPassword : function(oldPwd, newPwd){
      $http({
        method: 'POST',
        url: 'api/subscriber/editpassword',
        headers: {
          "X-Access-Token": accessToken
        },
        data: JSON.stringify({
          oldPassword: oldPwd,
          newPassword: newPwd
        })
      }).success(function(data){
        if(data.value){
          $rootScope.$broadcast("editPasswordSuccess");
        }
        else if(data.error.type == 'incorrectPwd'){
          $rootScope.$broadcast("incorrectPwd");
        } else if(data.error.type == 'badPwd'){
          $rootScope.$broadcast("badPwd");
        }
      }).error(function(data){
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
				if(data.value) {
          console.log('successfully registered');
          $rootScope.$broadcast("registrationSuccess");  
        } else if(data.error.type == 'emailInUse'){
          $rootScope.$broadcast("emailInUse");
        }
      }).error(function(data) {
      });
    },
    verify : function(verificationToken) {
      $http({
        method: 'POST',
        url: 'api/subscriber/verify',
        data: JSON.stringify({
          token: verificationToken
        })
      }).success(function(data) {
				if(data.value){
					console.log('broadcasting successful verification');
					$rootScope.$broadcast("verificationSuccessful");
				} else if(data.error.type == 'subscriberAlreadyVerified'){
					$rootScope.$broadcast("alreadyVerified");
				}
      }).error(function(data) {
      });
    },
    reset : function(subEmail) {
      $http({
        method: 'POST',
        url: 'api/subscriber/forgotpassword',
        data: JSON.stringify({
          email: subEmail
        })
      }).success(function(data) {
					if(data.value){
        		$rootScope.$broadcast("forgotSuccess");
					} else if (data.error.type == 'subscriberNotFound'){
						$rootScope.$broadcast("subscriberNotFound");
					} 
      }).error(function(data) {
      });
    },
		resetPassword : function(token, newPassword){
			$http({
				method: 'POST',
				url: 'api/subscriber/resetpassword',
				data: JSON.stringify({
					reset_token: token,
					password: newPassword
				})
			}).success(function(data){
				if(data.value){
					$rootScope.$broadcast("resetSuccessful");
				} else if(data.error.type == 'invalidResetToken'){
					$rootScope.$broadcast("invalidResetToken");
				} else if(data.error.type == 'badPwd'){
					$rootScope.$broadcast("badPwd");
				}
			}).error(function(data){
			});
		},
    request : function(type, module, body, good, bad) {
      $http({
        method: type,
        url: 'api/' + module,
        headers: {
          "X-Access-Token": accessToken
        },
        data: body
      }).success(function(data) {
        if(good)
          good(data);
      }).error(function(data) {
        if(bad)
          bad(data);
      });
    }
  };
});

flowAPI.factory('flowsim', function(flowgrammable) {
  var flowg = flowgrammable();
  return {
    createProfile : function(body) {
      flowg.request('POST', 'profile', JSON.stringify(body));
    }
  };
});
