
var flowsimApp = angular.module('flowsimApp', ['ngRoute']);

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
      templateUrl: 'register.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

flowsimApp.controller('flowsimCtrl', function($scope) {
  $scope.authenticated = true;
  $scope.logout = function() {
    $scope.authenticated = false;
  }
});


