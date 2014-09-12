var flowsim = angular.module('flowsim', ['ngRoute']);

flowsim.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'main.html'
    })
    .when('/about', {
      templateUrl: 'about.html'
    })
    .when('/profile', {
      templateUrl: 'profile/profile.html'
    })
    .when('/switch', {
      templateUrl: 'switch/switch.html'
    })
    .when('/packet', {
      templateUrl: 'packet/packet.html'
    })
    .when('/simulator', {
      templateUrl: 'simulator/simulator.html'
    })
    .when('/help', {
      templateUrl: 'help/help.html'
    })
    .when('/login', {
      templateUrl:'subscriber/login.html'
    })
    .when('/register', {
      templateUrl:'subscriber/register.html'
    })
    .otherwise({
      templateUrl: 'lost.html'
    });
}]);

flowsim.controller('flowsimCtlr', function($scope) {
  $scope.authenticated = false;
  $scope.value = 1;
});
