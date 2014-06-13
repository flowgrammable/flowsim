
var flowsim = angular.module('flowsim', ['ngRoute', 'ui.bootstrap']);

flowsim.controller('signinController', function($scope) {
  console.log('singin-controller');
	$scope.data = data;
  $scope.showVerified = true;
});

flowsim.controller('signupController', function($scope, $http) {
  console.log('singup-controller');
  $scope.subscriber = {};
  $scope.showUserError = false;
  $scope.registerSuccess = false;
  $scope.showCheckEmail = false;
  $scope.showDuplicateUser = false;
  $scope.createSubscriber = function() {
    $scope.showUserError = false;
    $scope.showDuplicateUser = false;
		$http({
			method: 'POST',
			url : '/subscribers',
      data: $scope.subscriber
			}).success(function(data, status, headers, config){
         $scope.data = data;
				  console.log(status); 
          $scope.showCheckEmail = true; 
					$scope.registerSuccess = true;
		}).error(function(data, status, headers, config){
				switch(status){
					case 400:
						$scope.showUserError = true;
						break;
					case 409:
						$scope.showDuplicateUser = true;
						break;
					default:
				}
		})
		
	}

});

flowsim.controller('mainController', function($scope) {
  console.log('main-controller');
});

flowsim.controller('verifiedController', function($scope) {
	console.log('verified-controller');
  $scope.data = data;
});

flowsim.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/signin', {
    templateUrl: 'html/signin.html',
    controller: 'signinController'
  })
  .when('/signup', {
    templateUrl: 'html/signup.html',
    controller: 'signupController'
  })
  .when('/verified', {
		templateUrl: 'html/verified.html',
		controller: 'verifiedController'
	})
  .when('/register', {
    templateUrl: 'html/register.html',
    controller: 'registerController'
  })
  .otherwise({
    templateUrl: 'html/main.html',
    controller: 'mainController'
  });
}]);

flowsim.directive('fsMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'html/menu.html'
  };
});

flowsim.directive('fsJumbo', function() {
  return {
    restrict: 'E',
    templateUrl: 'html/jumbo.html',
    transclude: true
  };
});

flowsim.directive('fsSignup', function() {
  return {
    templateUrl: 'signup.html',
    restrict: 'E'
  }
});
