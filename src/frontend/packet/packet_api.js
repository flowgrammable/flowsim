var packetAPI = angular.module('packetAPI', []);

packetAPI.factory('packetFactory', ['$http', '$rootScope', function($http,
	$rootScope){
	var urlBase = '/api/packet/';
	var packetFactory = {};

	packetFactory.create = function(data) {
		return $http.post(urlBase + 'create', data);
		};

	packetFactory.list = function() {
		return $http.get(urlBase + 'list');
	};

	packetFactory.update = function(data) {
		return $http.put(urlBase + 'update', data);
	};

	packetFactory.delete = function(data) {
		console.log('data from delete: ' + data);
		return $http.put(urlBase + 'delete', data);
	};
	
  return packetFactory;
}]);
