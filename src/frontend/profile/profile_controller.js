var profile = angular.module('profile', ['ngRoute', 'ui.bootstrap', 
	'profileAPI']);

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
		templateUrl: 'create_profile_form.html',
	}
});

profile.controller('createCntrl', ['$scope', 'profileFactory',
	function($scope, profileFactory){
		$scope.name = '';
		$scope.creationSuccess = false;
    $scope.profileList = [];
		$scope.create = function() {
			var profile = {name: $scope.name};
			profileFactory.create(profile)
				.success(function(data){
					if(data.value){
						$scope.showCreate = false;
						$scope.name = '';
						$scope.getProfiles();
					}
					else if(data.error.type == 'invalidProfileName'){
						$scope.invalidProfileName = true;
					}}).error(function(data){
				});
			
		};
		$scope.getProfiles = function(){
			profileFactory.list()
				.success(function(data){
					if(data.value){
						$scope.profileList = data.value.profileList;
					}
				}).error(function(data){});
		};
    $scope.getProfiles();		
}]);

