var profileAPI = angular.module('profileAPI', []);

profileAPI.factory('profileFactory', ['$http', '$rootScope', function($http,
	$rootScope){
	var urlBase = '/api/profile/';
	var profileFactory = {};

	profileFactory.create = function(data) {
		return $http.post(urlBase + 'create', data);
		};

	profileFactory.list = function() {
		return $http.get(urlBase + 'list');
	};

	profileFactory.update = function(data) {
		return $http.put(urlBase + 'update', data);
	};
	
  return profileFactory;
}]);
