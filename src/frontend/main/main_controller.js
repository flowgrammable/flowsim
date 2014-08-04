var flowsimApp = angular.module('flowsimApp', ['ngRoute', 'ui.bootstrap',
		'subscriber', 'profile']);

flowsimApp.controller('menutCtrl', function($scope, $rootScope, 
	subscriberFactory) {
	$scope.authenticated = false;
	
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
