var flowsim = angular.module('flowsim', ['ngRoute','ui.bootstrap']);

flowsim.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/signup',{
            templateUrl: 'subscriber/signup.html',
            controller: 'signupController'
        })
        .when('/signin',{
            templateUrl: 'subscriber/signin.html',
            controller: 'signinController'
        })
        .otherwise({
            templateUrl: 'dashboard/main.html',
            controller: 'dashboardController'
            });
}]);

flowsim.directive('fsMenu', function() {
    return {
        restrict: 'E',
        templateUrl: 'dashboard/menu.html'
    };
});
