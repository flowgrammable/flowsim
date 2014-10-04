
(function(){

var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var pwdPattern = /[a-zA-Z0-9_]{8,}/;

angular.module('fgSubscriber', ['ngResource'])
  .factory('Subscriber', function($resource) {
    var _x_access_token, _ops;
    _x_access_token = '';
    _ops = $resource('/api/subscriber/:op', {
        op: '@op'
      }, {
        'register': { method: 'POST', params: { op: 'register' } }, 
        'verify':   { method: 'POST', params: { op: 'verify' } },
        'forgot':   { method: 'POST', params: { op: 'forgot' } },
        'login':    { method: 'POST', params: { op: 'login' } },
        'logout':   { method: 'POST', params: { op: 'logout' },
                      headers: { 'x-access-token': _x_access_token }
        },
        'update':   { method: 'POST', params: { op: 'update' },
                      headers: { 'x-access-token': _x_access_token }
        }
      });
    return {
      x_access_token: _x_access_token,
      ops: _ops
    };
  })
  .controller('fgSubAuth', function($scope, Subscriber) {

    $scope.logout = function() {
      Subscriber.ops.logout({}, function(data) {
        Subscriber.x_access_token = '';
        if(data.error) {
        } else {
        }
      });
    };

    $scope.update = function() {
      if(!pwdPattern.test($scope.oldPassword)) {
         $scope.pwdError = true;
          $scope.pwdMsg = 'Bad password';
      } else if(!pwdPattern.test($scope.newPassword1)) {
         $scope.pwdError = true;
         $scope.pwdMsg = 'Bad password';
      } else if($scope.newPassword1 !== $scope.newPassword2) {
         $scope.pwdError = true;
         $scope.pwdMsg = 'Bad password';
      } else {
        Subscriber.ops.update({
          oldPassword: $scope.oldPassword,
          newPassword: $scope.newPassword1
        }, function(data) {
          if(data.error) {
          } else {
          }
        });
      }
    };

  })
  .controller('fgSubLogin', function($scope, Subscriber) {

    $scope.login = function() {
      if(!emailPattern.test($scope.email)) {
         $scope.emailError = true;
         $scope.emailMsg = 'Invalid email address';
      } else if(!pwdPattern.test($scope.password)) {
         $scope.pwdError = true;
         $scope.pwdMsg = 'Bad password';
      } else {
        Subscriber.ops.login({
          email: $scope.email,
          password: $scope.password
        }, function(data) {
          if(data.error) {
          } else {
            Subscriber.x_access_token = data.token;
          }
        });
      }
    };
    
    $scope.forgot = function() {
      if(!emailPattern.test($scope.email)) {
        $scope.emailError = true;
        $scope.emailMsg = 'Invalid email address';
      } else {
        Subscriber.ops.forgot({
          email: $scope.email
        }, function(data) {
          if(data.error) {
          } else {
          }
        });
      }
    };

  })
  .controller('fgSubRegister', function($scope, Subscriber) {

    $scope.email     = '';
    $scope.password1 = '';
    $scope.password2 = '';

    $scope.success = false;
    $scope.failure = false;

    function reset() {
      $scope.emailError = false;
      $scope.emailMsg = '';

      $scope.pwd1Error = false;
      $scope.pwd1Msg = '';
  
      $scope.pwd2Error = false;
      $scope.pwd2Msg = '';
    }

    $scope.register = function() {
      // Reset any existing error indications
      reset();
      // Test the input for validity
      if(!emailPattern.test($scope.email)) {
        $scope.emailError = true;
        $scope.emailMsg = 'Invalid email address';
      } else if(!pwdPattern.test($scope.password1)) {
        $scope.pwd1Error = true;
        $scope.pwd1Msg = 'Bad password';
      } else if($scope.password1 !== $scope.password2) {
        $scope.pwd2Error = true;
        $scope.pwd2Msg = 'Passwords do not match';
      } else {
        // Create a new subscriber
        Subscriber.ops.register({
          email:    $scope.email,
          password: $scope.password1
        }, function(data) {
          if(data.error) {
            console.log(data.error);
            $scope.failure = true;
          } else {
            console.log(data.value);
            $scope.success = true;
          }
        });

        /*
        var subscriber = new Subscriber({
          email:    $scope.emailAddr,
          password: $scope.pwd1
        });
        subscriber.$register().then(function(data) {
          if(data.error) {
            console.log(data.error);
            $scope.failure = true;
          } else {
            console.log(data.value);
            $scope.success = true;
          }
        });
        */
      }
    };
});

})();
