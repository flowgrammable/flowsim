var _switch = angular.module('_switch', ['ngRoute', 'ui.bootstrap', 
	'_switchAPI']);

_switch.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/switch', {
      templateUrl: 'switch.html',
      //controller: '_switchCntrl'
    });
}]);

_switch.directive('fsCreateswitch', function(){
	return {
		restrict: 'E',
		templateUrl: 'create_switch.html'
	}
});


_switch.controller('createSwitchCntrl', ['$scope', 'profileFactory',
	function($scope, profileFactory){
		$scope.name = '';
		$scope.creationSuccess = false;
    $scope.profileList = [];
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

