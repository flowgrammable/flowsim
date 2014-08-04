var subscriber = angular.module('subscriber', ['ngRoute', 'ui.bootstrap',
		'flowAPI']);

//var flowsimApp = angular.module('flowsimApp', ['ngRoute', 'ui.bootstrap',
//    'flowAPI']);


subscriber.controller('registrationCntrl', ['$scope', 'subscriberFactory', 'utils',
  function($scope, subscriberFactory, utils){
    $scope.emailAddr = '';
    $scope.password1 = '';
    $scope.password2 = '';
    $scope.registrationSuccess = false;

    $scope.register = function() {
      if(utils.validEmail($scope.emailAddr)) {
        $scope.badEmail = false;
      } else {
        $scope.badEmail = true;
      }
      if(utils.validPwd($scope.password1)) {
        $scope.badPwd1 = false;
      } else {
        $scope.badPwd1 = true;
      }
      if($scope.password1 == $scope.password2) {
        $scope.badPwd2 = false;
      } else {
        $scope.badPwd2 = true;
      }
      if(!$scope.badEmail && !$scope.badPwd1 && !$scope.badPwd2) {
        var subscriber = {email: $scope.emailAddr, password: $scope.password1 }
        subscriberFactory.register(subscriber)
          .success(function(data){
            if(data.value){
              $scope.registrationSuccess = true;
            } else if(data.error.type == 'emailInUse'){
              $scope.emailInUse = true;
            }
          }).error(function(data){
        });
      }
    }
}]);

subscriber.controller('resetCntrl', ['$scope', 'subscriberFactory', 'utils',
  function($scope, subscriberFactory, utils){
    $scope.emailAddr = '';

    $scope.reset = function() {
      if(utils.validEmail($scope.emailAddr)) {
        var resetBody = {email: $scope.emailAddr};
        subscriberFactory.reset(resetBody)
          .success(function(data){
            if(data.value){
              $scope.forgotSuccess = true;
            } else if(data.error.type == 'subscriberNotFound'){
              $scope.subscriberNotFound = true;
            }
          }).error(function(data){
          });
      } else {
      $scope.badEmail = true;
      }
    }

}]);

subscriber.controller('resetPassCntrl', ['$scope', '$routeParams', 'subscriberFactory', 'utils',
  function($scope, $routeParams, subscriberFactory, utils){
    $scope.token = $routeParams.token;
    $scope.password1 = '';
    $scope.password2 = '';

    $scope.resetPass = function(){
      if(utils.validPwd($scope.password1)){
        $scope.badPwd1 = false;
      } else {
        $scope.badPwd1 = true;
      }   
      if(utils.validPwd($scope.password2)){
        $scope.badPwd2 = false;
      } else {
        $scope.badPwd2 = true;
      }
      if(!$scope.badBwd1 && !$scope.badPwd2){
        var data = {reset_token: $scope.token,
                    password: $scope.password1 };
        subscriberFactory.resetPass(data)
          .success(function(data){
            if(data.value){
              $scope.resetSuccessful = true;
            } else if(data.error.type == 'invalidResetToken'){
              $scope.invalidResetToken = true;
            } else if(data.error.type == 'badPwd'){
              $scope.badPwd = true;
            }
          }).error(function(data){

          });
      }
    }
}]);

subscriber.controller('loginCntrl', ['$scope', '$location','$rootScope','subscriberFactory', 'utils',
  function($scope, $location, $rootScope, subscriberFactory, utils){
    $scope.emailAddr = '';
    $scope.password = '';

    $scope.login = function(){
      if(!utils.validEmail($scope.emailAddr)) {
        $scope.badEmail = true;
      } else {
        $scope.badEmail = false;
      }
      if(!utils.validPwd($scope.password)) {
        $scope.badPwd = true;
      } else {
        $scope.badPwd = false;
      }
      if(!$scope.badEmail && !$scope.badPwd){
        var data = {email: $scope.emailAddr, password: $scope.password};
        subscriberFactory.login(data)
          .success(function(data){
            if(data.value){
              $rootScope.token = data.value;
              $rootScope.$broadcast("authenticated");
              $location.path("/");
            } else if(data.error.type == 'subscriberNotActive'){
              $scope.subscriberNotActive = true;
            } else if(data.error.type == 'incorrectPwd'){
              $scope.incorrectPwd = true;
            } else if(data.error.type == 'subscriberNotFound'){
              $scope.subscriberNotFound = true;
            }
          }).error(function(data){
          });
      }
    }
}]);


subscriber.controller('verifyCntrl', ['$scope', '$routeParams','subscriberFactory',
  function($scope, $routeParams, subscriberFactory){
    var data = {token: $routeParams.token};
    subscriberFactory.verify(data)
      .success(function(data){
        if(data.value){
          $scope.verifySuccess = true;
        } else if(data.error.type == 'alreadyVerified'){
          $scope.alreadyVerified = true;
        }
      }).error(function(data){

      });
}]);


subscriber.controller('menuCtrl', function($scope, $rootScope, subscriberFactory) {
  $scope.authenticated = false;


  $scope.logout = function() {
    subscriberFactory.logout()
      .success(function(data){
        $scope.authenticated = false;
      }).error(function(data){
      });
  }

  $scope.$on("authenticated", function() {
    $scope.authenticated = true;
  });
  
  $scope.$on("unauthenticated", function() {
    $scope.authenticated = false;
  });

});

subscriber.controller('editPassCntrl', function($scope, subscriberFactory, utils){
  $scope.oldPassword = '';
  $scope.password1 = '';
  $scope.password2 = '';

  $scope.editPassword = function(){
    if(utils.validPwd($scope.oldPassword)){
      $scope.oldPwd = false;
    } else {
      $scope.oldPwd = true;
    }
    if(utils.validPwd($scope.password1)){
      $scope.badPwd1 = false;
    } else {
      $scope.badPwd1 = true;
    }   
    if(utils.validPwd($scope.password2)){
      $scope.badPwd2 = false;
    } else {
      $scope.badPwd2 = true;
    } 
    if(!$scope.badPwd1 && !$scope.badPwd2){
      var data = {oldPassword: $scope.oldPassword, 
                  newPassword: $scope.password1};
      subscriberFactory.editPassword(data)
        .success(function(data){
          if(data.value){
            $scope.editPasswordSuccess = true;
          } else if (data.error.type == 'incorrectPwd'){
            $scope.incorrectPwd = true;
          } else if (data.error.type == 'badPwd'){
            $scope.badPwd = true;
          }
        }).error(function(data){
        });
    }    
  }
});



subscriber.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'login.html',
      controller: 'loginCntrl'
    }).
    when('/register', {
      templateUrl: 'register.html',
      controller: 'registrationCntrl'
    }).
    when('/reset', {
      templateUrl: 'reset.html',
      controller: 'resetCntrl'
    }).
		when('/reset/:token', {
			templateUrl: 'resetpassword.html',
			controller: 'resetPassCntrl'
		}).
    when('/verify/:token', {
      templateUrl: 'verify.html',
      controller: 'verifyCntrl'
    }).
    when('/settings', {
      templateUrl: 'settings.html'
    }).
    when('/editpassword', {
      templateUrl: 'editpassword.html',
      controller: 'editPassCntrl'
    }).
    otherwise({
      templateUrl: 'lost.html'
    });
}]);

