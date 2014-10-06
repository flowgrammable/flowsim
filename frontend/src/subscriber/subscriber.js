
(function(){

var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var pwdPattern = /[a-zA-Z0-9_]{8,}/;

function resetField(scope, name) {
  scope[name].Err = false;
  scope[name].Msg = '';
}

function checkEmail(scope, name) {
  if(!emailPattern.test(scope[name])) {
    scope[name].Err = true;
    scope[name].Msg = 'Not an email address';
    return false;
  } else {
    return true;
  }
}

function checkPassword(scope, name) {
  if(!pwdPattern.test(scope[name])) {
    scope[name].Error = true;
    scope[name].Msg = 'Bad password';
    return false;
  } else {
    return true;
  }
}

angular.module('fgSubscriber', ['ngResource'])
  .factory('Subscriber', function($resource) {
    var _x_access_token = '';
    return {
      get: function() { return _x_access_token; },
      set: function(t) { _x_access_token = t; },
      ops: $resource('/api/subscriber/:op', {
          op: '@op'
        }, {
          'register': { method: 'POST', params: { op: 'register' } },
          'verify':   { method: 'POST', params: { op: 'verify' } },
          'forgot':   { method: 'POST', params: { op: 'forgot' } },
          'login':    { method: 'POST', params: { op: 'login' } },
          'logout':   { method: 'POST', params: { op: 'logout' },
                        headers: { 'x-access-token': _x_access_token } },
          'update':   { method: 'POST', params: { op: 'update' },
                        headers: { 'x-access-token': _x_access_token } }
        })
    };
  })
  .controller('fgSubAuth', function($scope, Subscriber, $route) {

    $scope.logout = function() {
      console.log('lg: ' + Subscriber.get());
      Subscriber.ops.logout({
        headers: { 'x-access-token': Subscriber.get() }
      }, {}, function(data) {
        if(data.error) {
          console.log('fail');
        } else {
          console.log('succ');
        }
        Subscriber.set('');
        $scope.$emit('unauthenticated');
        $route.reload();
      });
    };

    $scope.update = function() {
        resetField($scope, 'oldPassword');
        resetField($scope, 'newPassword1');
        resetField($scope, 'newPassword2');

      if(checkPassword($scope, 'oldPassword') &&
         checkPassword($scope, 'newPassword1') &&
         checkPassword($scope, 'newPassword2') &&
         ($scope.newPassword1 === $scope.newPassword2)) {

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
  .controller('fgSubLogin', function($scope, $location, $route, Subscriber) {

    $scope.login = function() {
        resetField($scope, 'email');
        resetField($scope, 'password');
        $scope.loginFail = false;

      if(checkEmail($scope, 'email') &&
         checkPassword($scope, 'password')) {

        Subscriber.ops.login({
          email: $scope.email,
          password: $scope.password
        }, function(data) {
          if(data.error) {
            $scope.loginFail = true;
          } else {
            Subscriber.set(data.value['x-access-token']);
            $scope.$emit('authenticated');
            $location.path('/');
            $route.reload();
          }
        });
      }
    };
    
    $scope.reset = function() {
      $scope.success = false;
      resetField($scope, 'email');
      if(checkEmail($scope, 'email')) {
        Subscriber.ops.forgot({
          email: $scope.email
        }, function(data) {
          if(data.error) {
          } else {
            $scope.success = true;
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

    $scope.register = function() {
      // Reset any existing error indications
      resetField($scope, 'email');
      resetField($scope, 'password1');
      resetField($scope, 'password2');
      // Test the input for validity
      if(checkEmail($scope, 'email') &&
         checkPassword($scope, 'password1') &&
         checkPassword($scope, 'password2')) {
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
  })
  .controller('fgVerify', function($scope, $routeParams, Subscriber) {
    Subscriber.ops.verify({
      token: $routeParams.token
    }, function(data) {
      if(data.error) {
        $scope.tokenFailed = true;
        // There are actually two types of failures, come back and adjust
        $scope.verficationMsg = 'Your token is invalid for some reason';
      } else {
        $scope.tokenVerified = true;
      }
    });
  });

})();
