
var flowsimApp = angular.module('flowsimApp', ['ngRoute', 'ui.bootstrap',
    'flowAPI']);

flowsimApp.controller('registrationCntrl', function($scope, utils, flowgrammable) {
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
    if(!$scope.badEmail && !$scope.badPwd1 & !$scope.badPwd2) {
      flowgrammable.register($scope.emailAddr, $scope.password1);
        $scope.$on("registrationSuccess", function() { 
          $scope.registrationSuccess = true; 
        });

        $scope.$on("emailInUse", function() { 
          $scope.emailInUse = true; 
        });
    }
  }
});

flowsimApp.controller('resetCntrl', function($scope, flowgrammable, utils) {
  $scope.sent = false;
  $scope.emailAddr = '';
  $scope.reset = function() {
    if(utils.validEmail($scope.emailAddr)) {
      flowgrammable.reset($scope.emailAddr);
      $scope.sent = true;
    } else {
      $scope.badEmail = true;
    }
  }
});

flowsimApp.controller('loginCntrl', function($scope, $location, flowgrammable, utils, $rootScope) {
  $scope.emailAddr = '';
  $scope.password = '';
  $scope.login = function() {
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
    if(!$scope.badEmail && !$scope.badPwd) {
      flowgrammable.login($scope.emailAddr, $scope.password);
      $rootScope.$on("loginFailure", function() { 
        $scope.loginFail = true; 
      });
      $rootScope.$on("subscriberNotActive", function() { 
        $scope.subscriberNotActive = true; 
      });
      $rootScope.$on("authenticated", function() { $location.path("/"); });
			$rootScope.$on("subscriberNotFound", function(){
				$scope.subscriberNotFound = true;
			});
    }
  };
});

flowsimApp.controller('verifyCntrl', function($scope, $routeParams, 
                        flowgrammable) {
  
  $scope.verifySuccess = false;
	$scope.alreadyVerified = false;
	flowgrammable.verify($routeParams.token);
	$scope.$on("verificationSuccessful", function(){
		console.log('verificationSuccessful has been broadcasted');
		$scope.verifySuccess = true;
	});
	$scope.$on("alreadyVerified", function(){
		console.log('alreadyVerified has been broadcasted');
		$scope.alreadyVerified = true;
	});
});

flowsimApp.controller('menuCtrl', function($scope, flowgrammable) {
  $scope.authenticated = false;
  $scope.token = '';

  $scope.logout = function() {
    flowgrammable.logout();
  }

  $scope.$on("authenticated", function() {
    $scope.authenticated = true;
  });
  
  $scope.$on("unauthenticated", function() {
    $scope.authenticated = false;
  });

});

flowsimApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'main.html'
    }).
    when('/about', {
      templateUrl: 'about.html'
    }).
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
    when('/verify/:token', {
      templateUrl: 'verify.html',
      controller: 'verifyCntrl'
    }).
    otherwise({
      templateUrl: 'lost.html'
    });
}]);

