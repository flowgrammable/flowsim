flowsim.controller('signupController', function($scope, $http){
    console.log('signup-controller');
    // do signup stuff here
    $scope.subscriber = {};
    $scope.createSubscriber = function() {
			$http({
					method: 'POST',
					url : '/subscribers',
					data : $scope.subscriber
			}).success(function(data, status, headers, config){
				$scope.data = data;
			}).error(function(data, status, headers, config){
				$scope.data = data;
			})
		}
});

flowsim.controller('signinController', function($scope, $http){
    console.log('signin-controller');
});
