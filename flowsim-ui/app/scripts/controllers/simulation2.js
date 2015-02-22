'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:Simulation2Ctrl
 * @description
 * # SimulationCtrl
 * SimulationCtrl is responsible for control of the dataplane simulation and 
 * triggering visualizations. There are two visualizations to be aware of: 
 *  * Stage Transitions - arrival -> extraction -> ... -> execution
 *  * Stage steps - for instance extraction stage has a step visualization
 *  for each header in the packet 
 * 
 * Play - tell simulation service to play a trace
 * Step - tell simulation service to step
 * Stop - stop the simulation
 * 
 */
angular.module('flowsimUiApp')
  .controller('Simulation2Ctrl', function ($scope, $state, $rootScope, 
    fgCache, fgStore, Trace, Simulation) {
    var SimCtrl = this;
    this.simulation = Simulation.Simulation;
    this.stages = Simulation.Stages;
    this.transitions = Simulation.Transitions;
    this.traceName = '';
    this.view = {};

    this.play = function (){
      this.makeTransition = {to: SimCtrl.simulation.stage };
      this.simulation.play(SimCtrl.trace);
    };

    this.step = function(){
      var state = '';
      this.simulation.step();
      this.view = this.simulation.view;
      if(this.simulation.isDone()){
        this.stop();
      } else {
        this.makeTransition = {to: SimCtrl.simulation.stage };
        state = this.simulation.dataplane.state.toLowerCase();
        $state.go('simulation.stages.'+state);
        //broadcast to stage directives that a step has occured
        $rootScope.$broadcast('stageStep');
      }

    };

    this.stop = function(){
      this.simulation.stop();
      $state.go('simulation.stages.setup');
    };

    this.loadTrace = function() {
      if(!SimCtrl.traceName) {
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

  //Load trace once it is set
  $rootScope.$on('setTrace', function(event, data){
    SimCtrl.traceName = data;
    SimCtrl.loadTrace();
  });

  $scope.$on('$destroy', function(){
    SimCtrl.simulation.stop();
  });

  if(!SimCtrl.simulation.active){
    $state.go('simulation.stages.setup');
  }

});
