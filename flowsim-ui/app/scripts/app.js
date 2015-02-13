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
    'ui.bootstrap',
    'ui.router'
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
        controller: 'Simulation2Ctrl'
      })
      .state('simulation.setup', {
        templateUrl: 'views/simulation/setup.html',
        controller: 'SimSetupCtrl'
      })
      .state('simulation.arrival', {
        templateUrl: 'views/simulation/arrival.html'
      })
      .state('simulation.extraction', {
        templateUrl: 'views/simulation/extraction.html'
      })
      .state('simulation.choice', {
        templateUrl: 'views/simulation/choice.html'
      })
      .state('simulation.selection', {
        templateUrl: 'views/simulation/selection.html'
      })
      .state('simulation.execution', {
        templateUrl: 'views/simulation/execution.html'
      })
      .state('simulation.groups', {
        templateUrl: 'views/simulation/groups.html'
      })
      .state('simulation.egress', {
        templateUrl: 'views/simulation/egress.html'
      })
      .state('subscriber', {
        url: '/subscriber',
        templateUrl: 'views/subscriber.html'
      })
      .state('subscriber.login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('subscriber.register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .state('subscriber.update', {
        url: '/update',
        templateUrl: 'views/update.html',
        controller: 'UpdateCtrl'
      })
      .state('subscriber.verify', {
        url: '/verify/:token',
        templateUrl: 'views/verify.html',
        controller: 'VerifyCtrl'
      })
      .state('subscriber.forgot', {
        url: '/forgot',
        templateUrl: 'views/forgot.html',
        controller: 'ForgotCtrl'
      })
      .state('subscriber.reset', {
        url: '/reset/:token',
        templateUrl: 'views/reset.html',
        controller: 'ResetCtrl'
      })
      .state('Main' ,{
        url: '*path',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  });
