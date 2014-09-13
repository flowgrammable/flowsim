
(function(){

angular.module('fgSubscriber', [])
  .controller('fgSubscriberCtrl', function($scope) {

    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var pwdPattern = /[a-zA-Z0-9_]{8,}/;

    $scope.success = false;
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
      if(!emailPattern($scope.emailAddr) {
        $scope.emailError = true;
        $scope.emailMsg = 'Invalid email address';
      } else if(!pwdPattern.test($scope.pwd1)) {
        $scope.pwd1Error = true;
        $scope.pwd1Msg = 'Bad password';
      } else if($scope.pwd1 != $scope.pwd2) {
        $scope.pwd2Error = true;
        $scope.pwd2Msg = 'Passwords do not match';
      } else {
        $scope.success = true;
        // send a registration request
      }
    };
});

})();
