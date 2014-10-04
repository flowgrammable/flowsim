
(function(){

angular.module('fgSubscriber', ['ngResource'])
  .factory('Subscriber', function($resource) {
    return $resource('/api/subscriber/:op', {
        op: '@op'
      }, {
        'register': { method: 'POST', params: { op: 'register' } },
        'verify':   { method: 'POST', params: { op: 'verify' } },
        'forgot':   { method: 'POST', params: { op: 'forgot' } },
        'login':    { method: 'POST', params: { op: 'login' } },
        'logout':   { method: 'POST', params: { op: 'logout' } },
        'update':   { method: 'POST', params: { op: 'update' } }
      });
  })
  .controller('fgSubscriberCtrl', function($scope, Subscriber) {

    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var pwdPattern = /[a-zA-Z0-9_]{8,}/;

    $scope.success = false;
    $scope.failure = false;
    $scope.emailAddr = '';
    $scope.pwd1 = '';
    $scope.pwd2 = '';

    function reset() {
      $scope.emailError = false;
      $scope.emailMsg = '';

      $scope.pwd1Error = false;
      $scope.pwd1Msg = '';
  
      $scope.pwd2Error = false;
      $scope.pwd2Msg = '';
    }

    $scope.createSub = function() {
      reset();
      if(!emailPattern.test($scope.emailAddr)) {
        $scope.emailError = true;
        $scope.emailMsg = 'Invalid email address';
      } else if(!pwdPattern.test($scope.pwd1)) {
        $scope.pwd1Error = true;
        $scope.pwd1Msg = 'Bad password';
      } else if($scope.pwd1 !== $scope.pwd2) {
        $scope.pwd2Error = true;
        $scope.pwd2Msg = 'Passwords do not match';
      } else {
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
      }
    };
});

})();
