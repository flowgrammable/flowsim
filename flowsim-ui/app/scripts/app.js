'use strict';

/**
 * @ngdoc overview
 * @name flowsimUiApp
 * @description
 * # flowsimUiApp
 *
 * Main module of the application.
 */
angular
  .module('flowsimUiApp', [
    'ngResource',
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap'
  ])
  .config(function ($tooltipProvider, $stateProvider) {
    $tooltipProvider.options({
      popupDelay: 800
    });
    $stateProvider
      .state('packet', {
        url: '/packet',
        templateUrl: 'views/packet.html',
        controller: 'PacketCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('switch', {
        url: '/switch',
        templateUrl: 'views/switch.html',
        controller: 'SwitchCtrl'
      })
      .state('simulation', {
        url: '/simulation',
        templateUrl: 'views/simulation.html',
        controller: 'SimulationCtrl'
      })
      .state('Main' ,{
        url: '*path',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });

/*      .state('SimulationSetup',{
        templateUrl: 'views/simulation/setup.html'
      })
      .state('Arrival', {
        templateUrl: 'views/simulation/arrival.html'
      })
      .state('Extraction', {
        templateUrl: 'views/simulation/extraction.html'
      })
      .state('Choice', {
        templateUrl: 'views/simulation/choice.html'
      })
      .state('Selection', {
        templateUrl: 'views/simulation/selection.html'
      })
      .state('Execution', {
        templateUrl: 'views/simulation/execution.html'
      })
      .state('Groups', {
        templateUrl: 'views/simulation/groups.html'
      })
      .state('Egress', {
        templateUrl: 'views/simulation/egress.html'
      }) */
  });
