var _switchAPI = angular.module('_switchAPI', []);

_switchAPI.factory('_switchFactory', ['$http', '$rootScope', function($http,
	$rootScope){
	var urlBase = '/api/switch/';
	var _switchFactory = {};

	_switchFactory.create = function(data) {
		return $http.post(urlBase + 'create', data);
		};

	_switchFactory.list = function() {
		return $http.get(urlBase + 'list');
	};

	_switchFactory.update = function(data) {
		return $http.put(urlBase + 'update', data);
	};

	_switchFactory.delete = function(data) {
		console.log('data from delete: ' + data);
		return $http.put(urlBase + 'delete', data);
	};
	
  return _switchFactory;
}]);
