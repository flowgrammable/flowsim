var flowsimApp = angular.module('flowsimApp', ['ngRoute', 'ui.bootstrap',
		'subscriber', 'profile','packet', 'ngCookies']);

flowsimApp.controller('menuCtrl', function($cookies, $scope, $rootScope, 
	subscriberFactory) {
	$scope.authenticated = false;

	if($cookies.token){
		$scope.authenticated = true;
	}
	
	$scope.$on("authenticated", function() {
		$scope.authenticated = true;
	});

	$scope.$on("unauthenticated", function(){
		$scope.authenticated = false;
	});

});

flowsimApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {
			templateUrl: 'main.html'
		}).
		when('/about', {
			templateUrl: 'about.html'
		}).
		otherwise({
			templateUrl: 'lost.html'
		});
}]);
