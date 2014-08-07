var profileAPI = angular.module('profileAPI', []);

profileAPI.factory('profileFactory', ['$http', '$cookies', '$rootScope', function($http,
	$cookies, $rootScope){
	var urlBase = '/api/profile/';
	var profileFactory = {};

	profileFactory.create = function(body) {
		return $http({
			method: 'POST',
			url: 'api/profile/create',
			headers: {
				"X-Access-Token": $cookies.token
			},
			data: JSON.stringify(body)
		});
	};

	profileFactory.list = function() {
		return $http({
			method: 'GET',
			url: 'api/profile/list',
			headers: {
				"X-Access-Token": $cookies.token
			}
		});
	};

  profileFactory.detail = function(id){
		return $http({
			method: 'GET',
			url: 'api/profile/detail' + id,
			headers: {
				"X-Access-Token": $cookies.token
			}
		});
	};

	profileFactory.update = function(body) {
		return $http({
			method: 'PUT',
			url: 'api/profile/update',
			headers: {
				"X-Access-Token": $cookies.token
			},
			data: JSON.stringify(body)
		});
	};

	profileFactory.delete = function(itemId) {
			return $http({
			method: 'DELETE',
			url: 'api/profile/destroy/' + itemId,
			headers: {
				"X-Access-Token": $cookies.token
			}
		});
	};
	
  return profileFactory;
}]);
