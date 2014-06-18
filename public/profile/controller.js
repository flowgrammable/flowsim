flowsim.controller('profilelistController', function($scope, $http){
    console.log('profilelist-controller');
    $scope.profiles = [{id:1, name:"profilea"}, {id:2, name:"profileb"}];
	//	$http({
	//				method: 'GET',
	//				url : '/profiles',
	//		}).success(function(data, status, headers, config){
	//			$scope.profiles = data;
  //     
	//		}).error(function(data, status, headers, config){
	//			$scope.data = 'could not retrieve profiles';
	//		}) 
     $scope.data = 'profile should be listed here';
});
