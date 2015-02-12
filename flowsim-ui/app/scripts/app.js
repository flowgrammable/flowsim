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
        controller: 'SimulationCtrl'
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
