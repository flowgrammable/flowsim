var profileAPI = angular.module('profileAPI', []);

profileAPI.factory('profileFactory', ['$http', '$rootScope', function($http,
	$rootScope){
	var urlBase = '/api/profile/';
	var profileFactory = {};

	profileFactory.create = function(body) {
		return $http({
			method: 'POST',
			url: 'api/profile/create',
			headers: {
				"X-Access-Token": $rootScope.token
			},
			data: JSON.stringify(body)
		});
	};

	profileFactory.list = function() {
		return $http({
			method: 'GET',
			url: 'api/profile/list',
			headers: {
				"X-Access-Token": $rootScope.token
			}
		});
	};

	profileFactory.update = function(body) {
		return $http({
			method: 'PUT',
			url: 'api/profile/update',
			headers: {
				"X-Access-Token": $rootScope.token
			},
			data: JSON.stringify(body)
		});
	};

	profileFactory.delete = function(itemId) {
			return $http({
			method: 'DELETE',
			url: 'api/profile/destroy/' + itemId,
			headers: {
				"X-Access-Token": $rootScope.token
			}
		});
	};
	
  return profileFactory;
}]);
