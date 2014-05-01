
var flowsim = angular.module('flowsim', ['ngRoute', 'ui.bootstrap']);

flowsim.controller('signinCtrlr', function($scope) {
  console.log('singin-controller');
});

flowsim.controller('signupCtrlr', function($scope) {
  console.log('singup-controller');
});

flowsim.controller('mainCtrlr', function($scope) {
  console.log('main-controller');
});

flowsim.config(['$routeProvider', function($routeProvider) {
  console.log('config');
  $routeProvider.
  when('/signin', {
    templateUrl: 'signin.html',
    controller: 'signinCtrlr'
  }).
  when('/signup', {
    templateUrl: 'signup.html',
    controller: 'signupCtlr'
  }).
  when('/', {
    templateURL: 'main.html',
    controller: 'mainCtrlr'
  }).
  otherwise({
    redirectTo : '/'
  });
}]);
