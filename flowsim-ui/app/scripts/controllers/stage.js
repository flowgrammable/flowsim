'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:StageCtrl
 * @description
 * # StageCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('StageCtrl', function ($scope, $state, Simulation) {
  	console.log('at stage ctrl');
  	$scope.stages = _(Simulation.Stages).map(function(stage){
  		return stage.name;
  	});
  	console.log('stagectl state:', $state.$current.name);
  	//$state.go('simulation.stages')
});
