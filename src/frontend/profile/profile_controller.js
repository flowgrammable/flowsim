var profile = angular.module('profile', ['ngRoute', 'ui.bootstrap']);

profile.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/profile', {
      templateUrl: 'profile.html',
      //controller: 'profileCntrl'
    });
}]);

profile.directive('fsCreateprofile', function(){
	return {
		restrict: 'E',
		templateUrl: 'create_profile.html'
	}
});

profile.directive('fsProfilepost', function(){
	return {
		restrict: 'E',
		templateUrl: 'create_profile_form.html'
	}
});

