var packet = angular.module('packet', ['ngRoute', 'ui.bootstrap', 
	'packetAPI']);

packet.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/packet', {
      templateUrl: 'packet.html',
      //controller: 'packetCntrl'
    });
}]);

packet.directive('fsCreatepacket', function(){
	return {
		restrict: 'E',
		templateUrl: 'create_packet.html'
	}
});


<<<<<<< HEAD
packet.controller('createCntrl', ['$scope', 'packetFactory',
=======
packet.controller('createPacketCntrl', ['$scope', 'packetFactory',
>>>>>>> 48da2640202e0ad90e2726de899c5d76a742c0e4
	function($scope, packetFactory){
		$scope.name = '';
		$scope.creationSuccess = false;
    $scope.packetList = [];
		$scope.create = function() {
			var packet = {name: $scope.name};
			packetFactory.create(packet)
				.success(function(data){
					if(data.value){
						$scope.showCreate = false;
						$scope.name = '';
						$scope.getProfiles();
					}
					else if(data.error.type == 'invalidProfileName'){
						$scope.invalidProfileName = true;
					}}).error(function(data){
				});
			
		};
		$scope.getProfiles = function(){
			packetFactory.list()
				.success(function(data){
					if(data.value){
						$scope.packetList = data.value.packetList;
					}
				}).error(function(data){});
		};
    $scope.getProfiles();

		$scope.update = function(item){
			console.log('hit update');
			console.log('item id: ', item.id);
			console.log('mod name: ', item.name);
			var modifiedItem = { id:item.id, name: item.name }; 
			packetFactory.update(modifiedItem)
				.success(function(data){})
				.error(function(data){});
		};

		$scope.delete = function(item){
			var del = {id: item.id};
			packetFactory.delete(del)
				.success(function(data){
					if(data.value){
						$scope.getProfiles();
					}
				}).error(function(data){});
		};		
}]);

