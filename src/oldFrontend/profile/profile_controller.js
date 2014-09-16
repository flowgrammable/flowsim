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


profile.controller('createProfileCntrl', ['$scope', 'profileFactory',
	function($scope, profileFactory){
	//	$scope.name = '';
		$scope.creationSuccess = false;
    $scope.profileList = [];
		$scope.detail = {};
	$scope.create = function() {
		var profile = {name: $scope.profdata.name, ofp_version: $scope.profdata.version};
		profileFactory.create(profile)
			.success(function(data){
				if(data.value){
					$scope.showCreate = false;
					$scope.name = '';
                    $scope.version = '';
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
					$scope.profileList = data.value;
				}
			}).error(function(data){});
	};
    $scope.getProfiles();

		$scope.detail = function(id){
			profileFactory.detail(id)
				.success(function(data){
					if(data.value){
						$scope.detail = data.value;
					}
				}).error(function(data){});
		} 
		
		$scope.update = function(item){
			console.log('hit update');
			console.log('item id: ', item.id);
			console.log('mod name: ', item.name);
			var modifiedItem = { id:item.id, name: item.name }; 
			profileFactory.update(modifiedItem)
				.success(function(data){})
				.error(function(data){});
		};

		$scope.delete = function(item){
			profileFactory.delete(item.id)
				.success(function(data){
					if(data.value){
						$scope.getProfiles();
					}
				}).error(function(data){});
		};		
}]);

