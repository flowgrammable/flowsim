'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:Simulation2Ctrl
 * @description
 * # Simulation2Ctrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('Simulation2Ctrl', function ($scope, $state, Dataplane, Trace, Simulation) {
  	$scope.stages = Simulation.Stages;
  	$scope.transitions = Simulation.Transitions;
  	$scope.simulation = new Simulation.Simulation();
  	$scope.player = {
  		trace: '',
  		view: ''
  	};

  	$state.go('simulation.setup');
  	$scope.play = function(){
  		$scope.simulation.play($scope.player.trace);
	    $scope.makeTransition = {
		  to: $scope.simulation.stage
		};
		$scope.ctx = $scope.simulation.toView();
		$scope.view = $scope.simulation.toView();
  	};

  	$scope.step = function(){
  		$scope.simulation.step();
  		$scope.player.view = $scope.simulation.view;
  	}

  	$scope.stop = function(){
	    $scope.makeTransition = {to: -1};
	    $scope.simulation.stop();
	    $scope.player = {
	    	trace: '',
	    	view: ''
	    };
	    $state.go('simulation.setup');
  	};
});
