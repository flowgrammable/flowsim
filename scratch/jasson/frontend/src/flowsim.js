var flowsim = angular.module('flowsim', ['ngRoute']);

flowsim.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'main.html'
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
    .otherwise({
      redirectTo: 'lost.html'
    });
}]);

flowsim.controller('flowsimCtrl', function($scope) {
  $scope.items = ['one', 'two', 'three'];
});
