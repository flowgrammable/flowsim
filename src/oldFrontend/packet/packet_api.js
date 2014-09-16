var packetAPI = angular.module('packetAPI', []);

packetAPI.factory('packetFactory', ['$http', '$cookies', '$rootScope', 
  function($http, $cookies, $rootScope){
	  var urlBase = '/api/packet/';
	  var packetFactory = {};

	  packetFactory.create = function(body) {
		  return $http({
			  method: 'POST',
			  url: 'api/packet/create',
			  headers: {
				  "X-Access-Token": $cookies.token
			  },
			  data: JSON.stringify(body)
			  });
	  };

	  packetFactory.list = function() {
		  return $http({
			  method: 'GET',
			  url: 'api/packet/list',
			  headers: {
				  "X-Access-Token": $cookies.token
			  }
			});
	  };

	  packetFactory.update = function(body) {
		  return $http({
			  method: 'PUT',
			  url: 'api/packet/update',
			  headers: {
				  "X-Access-Token": $cookies.token
			  },
			  data: JSON.stringify(body)
			});
	  };

	  packetFactory.delete = function(itemId) {
		  console.log('data from delete: ' + data);
		  return $http({
			  method: 'DELETE',
			  url: 'api/profile/destroy/' + itemId,
			  headers: {
				  "X-Access-Token": $cookies.token
			  }
		  });
	  };
	
    return packetFactory;
}]);
