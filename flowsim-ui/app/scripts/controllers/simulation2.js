'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:Simulation2Ctrl
 * @description
 * # Simulation2Ctrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('Simulation2Ctrl', function ($scope, $state, $rootScope, fgCache, fgStore, Dataplane, Trace, Simulation) {
    var SimCtrl = this;
    this.stages = Simulation.Stages;
    this.transitions = Simulation.Transitions;
    this.simulation = new Simulation.Simulation();
    this.traceName = '';
    this.traces = '';
    this.getTraces = function(){
      fgStore.get('trace').then(function(names){
        SimCtrl.traces = names;
      });
    };
    this.getTraces();

    this.play = function (){
      this.simulation.play(SimCtrl.trace);
      this.makeTransition();
      this.ctx = this.simulation.toView();
      this.view = this.simulation.toView();
    };

    this.makeTransition = function(){
      return {to: SimCtrl.simulation.stage };
    };

    this.step = function(){
      this.simulation.step();
      this.view = this.simulation.view;
    };

    this.stop = function(){
      this.makeTransition();
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
