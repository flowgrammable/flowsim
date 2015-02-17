'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:Simulation2Ctrl
 * @description
 * # Simulation2Ctrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('Simulation2Ctrl', function ($scope, $state, $rootScope, fgCache, fgStore, Trace, Simulation) {
    var SimCtrl = this;
    this.stages = Simulation.Stages;
    this.transitions = Simulation.Transitions;
    this.simulation = Simulation.Simulation;
    this.traceName = '';
    this.traces = '';
    this.view = {};

    this.getTraces = function(){
      fgStore.get('trace').then(function(names){
        SimCtrl.traces = names;
      });
    };
    this.getTraces();

    this.play = function (){
      this.makeTransition = {to: SimCtrl.simulation.stage };
      this.simulation.play(SimCtrl.trace);
    };

    this.step = function(){
      this.simulation.step();
      this.view = this.simulation.view;
      if(this.simulation.isDone()){
        this.stop();
      } else {
        this.makeTransition = {to: SimCtrl.simulation.stage };
        $state.go('simulation.stages.'+this.simulation.dataplane.state.toLowerCase());
        $rootScope.$broadcast('stageStep');
      }

    };

    this.stop = function(){
      this.simulation.stop();
      $state.go('simulation.stages.setup');
    };

    this.loadTrace = function() {
      if(SimCtrl.traceName === undefined) {
        SimCtrl.trace = null;
      } else {
        fgCache.get('trace', SimCtrl.traceName, Trace, function(err, result) {
          if(err) {
            console.log('trace error:', err.details);
          } else {
            SimCtrl.trace = result;
          }
        });
      }
    };

  $scope.$watch('SimCtrl.traceName', function(){
    SimCtrl.loadTrace();
  });

  $rootScope.$on('assetUpdate', function(){
    SimCtrl.getTraces();
  });

});
