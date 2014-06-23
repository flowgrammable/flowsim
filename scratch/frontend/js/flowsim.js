
var flowsimApp = angular.module('flowsimApp', ['ngRoute']);

flowsimApp.controller('registrationCtrl', function($scope, $location) {
  $scope.emailAddr = '';
  $scope.password1 = '';
  $scope.password2 = '';
  $scope.sent = false;
  $scope.register = function() {
    console.log('%s %s/%s', $scope.emailAddr, $scope.password1, 
                $scope.password2);
    $scope.sent = true;
  }
});

flowsimApp.controller('mainCtrl', function($scope) {
  $scope.authenticated = true;
  $scope.logout = function() {
    $scope.authenticated = false;
  }
});

flowsimApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'main.html'
    }).
    when('/openflow', {
      templateUrl: 'openflow.html'
    }).
    when('/about', {
      templateUrl: 'about.html'
    }).
    when('/profile', {
      templateUrl: 'profile.html'
    }).
    when('/packet', {
      templateUrl: 'packet.html'
    }).
    when('/trace', {
      templateUrl: 'trace.html'
    }).
    when('/switch', {
      templateUrl: 'switch.html'
    }).
    when('/simulation', {
      templateUrl: 'simulation.html'
    }).
    when('/register', {
      templateUrl: 'account/register.html'
    }).
    when('/verify', {
      templateUrl: 'account/verify.html'
    }).
    when('/reset', {
      templateUrl: 'account/reset.html'
    }).
    when('/forgot', {
      templateUrl: 'account/forgot.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

