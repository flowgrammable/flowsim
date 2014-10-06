
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
      .otherwise({
        templateUrl: 'lost.html'
      });
  }])
  .controller('flowsimCtlr', function($scope) {
    $scope.authenticated = false;
  });

})();

