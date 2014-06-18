flowsim.controller('profilelistController', function($scope, $http){
    console.log('profilelist-controller');
    $scope.profiles = [{id:1, name:"profilea"}, {id:2, name:"profileb"}];

  //  Once controller is activated retrieve list of profiles
	//	$http({
	//				method: 'GET',
	//				url : 'api/profiles',
	//		}).success(function(data, status, headers, config){
	//			$scope.profiles = data;
  //     
	//		}).error(function(data, status, headers, config){
	//			$scope.data = 'could not retrieve profiles';
	//		}) 
     $scope.data = 'profile should be listed here';
	
});

flowsim.controller('profilecreateController', function($scope, $http){
		console.log('profilecreate-controller');
    $scope.profile = {};
		$scope.hideProfile = false;
		$scope.createProfile = function(){
			$http({
				method: 'POST',
				url: '/api/profile',
				data : $scope.profile
			}).success(function(data, status, headers, config) {
				$scope.data = 'Profile created'
				$scope.hideProfile = true;
			})
			.error(function(data, status, headers, config) {
				$scope.data = 'Profile could not be created';
			});
		}
});

flowsim.controller('profileeditController', function($scope, $http){
		console.log('profileedit-controller');
		$scope.profle = {};
    $scope.hideProfile = false;
    $http({
			method: 'GET',
      url: '/api/profile/',  //need to get profile id
    }).success(function(data, status, headers, config){
			$scope.profile = data;
		}).error(function(data, status, headers, config) {
			$scope.data = 'could not retrieve profile'
		});
});
