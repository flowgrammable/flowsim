
(function(){

angular.module('flowsim', ['ngRoute', 'ui.bootstrap', 'fgSubscriber'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main.html'
      })
      .when('/register', {
        templateUrl: 'subscriber/register.html'
      })
      .when('/verify/:token', {
        templateUrl: 'subscriber/verify.html'
      })
      .when('/login', {
        templateUrl: 'subscriber/login.html'
      })
      .when('/reset/:token', {
        templateUrl: 'subscriber/reset.html'
      })
      .otherwise({
        templateUrl: 'lost.html'
      });
  }])
  .controller('flowsimCtlr', function($scope, $rootScope) {
    $scope.authenticated = false;

    $rootScope.$on('authenticated', function() {
      $scope.authenticated = true;
    });
    $rootScope.$on('unauthenticated', function() {
      $scope.authenticated = false;
    });
  });

})();

