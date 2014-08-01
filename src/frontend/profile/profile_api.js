var profileAPI = angular.module('profileAPI', []);

profileAPI.factory('profileFactory', ['$http', '$rootScope', function($http,
	$rootScope){
	var urlBase = '/api/profile/';
	var profileFactory = {};

	profileFactory.create = function(data) {
		return $http.post(urlBase + 'create', data);
		};

}]);
