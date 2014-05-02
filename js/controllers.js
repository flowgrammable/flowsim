
var flowsim = angular.module('flowsim', ['ngRoute', 'ui.bootstrap']);

flowsim.controller('signinController', function($scope) {
  console.log('singin-controller');
});

flowsim.controller('signupController', function($scope) {
  console.log('singup-controller');
});

flowsim.controller('mainController', function($scope) {
  console.log('main-controller');
});

flowsim.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/signin', {
    templateUrl: 'signin.html',
    controller: 'signinController'
  })
  .when('/signup', {
    templateUrl: 'signup.html',
    controller: 'signupController'
  })
  .when('/register', {
    templateUrl: 'register.html',
    controller: 'registerController'
  })
  .otherwise({
    templateUrl: 'main.html',
    controller: 'mainController'
  });
}]);
