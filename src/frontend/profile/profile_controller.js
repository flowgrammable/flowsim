var profile = angular.module('profile', ['ngRoute', 'ui.bootstrap']);

profile.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/profile', {
      templateUrl: 'profile.html',
      //controller: 'profileCntrl'
    });
}]);

