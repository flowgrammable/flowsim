flowsim.controller('profilelistController', function($scope, $http){
    console.log('profilelist-controller');
	$scope.profiles = [];
  //  Once controller is activated retrieve list of profiles
		$http({
					method: 'GET',
					url : '/api/profile',
			}).success(function(data, status, headers, config){
				$scope.profiles = data;
       
			}).error(function(data, status, headers, config){
				$scope.data = 'could not retrieve profiles';
			}) 
     $scope.data = 'profile should be listed here';
	
});

flowsim.controller('profilecreateController', function($scope, $http){
		console.log('profilecreate-controller');
    /* Running into two issues with saving unchecks
     *   1)  node-orm2 is not setting false default (true works though)
     *   2)  angular-js does not post unchecked (false value) attribute
     * Temp solution
     *   set everything in profile object as false
     */ 

    $scope.profile = {vp_any:false, vp_local:false, vp_normal: false, vp_flood: false,
				ofpxmt_ofb_in_port: false, ofpxmt_ofb_in_phy_port: false, ofpxmt_ofb_eth_dest: false,
				ofpxmt_ofb_eth_src: false, ofpxmt_ofb_eth_type: false, 
				ofpat_set_field_eth_dst: false, ofpat_set_field_eth_src: false, ofpat_output: false};
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

flowsim.controller('profileeditController', function($scope, $http, $routeParams){
		console.log('profileedit-controller');
		$scope.data = {};
    $scope.hideProfile = false;
    $http({
			method: 'GET',
      url: '/api/profile/' + $routeParams.id,  //need to get profile id
    }).success(function(data, status, headers, config){
			$scope.data = data;
		}).error(function(data, status, headers, config) {
			$scope.data = 'could not retrieve profile'
		});

    $scope.editProfile = function() {
			$http({
				method: 'PUT',
				url: '/api/profile/' + $routeParams.id,
        data: $scope.profile
			}).success(function(data, status, headers, config){
				$scope.data = 'profile successfully updated';
			}).error(function(data, status, headers, config){
				$scope.data = 'could not update profile';
			});
		}
});
