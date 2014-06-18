flowsim.controller('signupController', function($scope, $http){
    console.log('signup-controller');
    // do signup stuff here
    $scope.hideSignup = false;
    $scope.subscriber = {};
    $scope.createSubscriber = function() {
			$http({
					method: 'POST',
					url : '/api/subscribers',
					data : $scope.subscriber
			}).success(function(data, status, headers, config){
				$scope.data = 'Registration Succesful - Check email for verification';
        $scope.hideSignup = true;
        
			}).error(function(data, status, headers, config){
				$scope.data = data;
			})
		}
});

flowsim.controller('signinController', function($scope, $http, $window){
    console.log('signin-controller');
		$scope.subscriber = {};
    $scope.loginSubscriber = function () {
			$http
				.post('/login', $scope.subscriber)
				.sucess(function (data, status, headers, config) {
					$window.sessionStorage.token = data.token;
				})
				.error(function (data, status, headers, config) {
					delete $window.sessionStorage.token;

					$scope.message = 'Error: Invalid user or password';
				});
		}
});
