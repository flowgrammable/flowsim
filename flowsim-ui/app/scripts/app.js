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
    'ui.router',
    'angulartics',
    'angulartics.google.analytics',
    'ct.ui.router.extras'
  ])
  .config(function ($tooltipProvider, $stateProvider, $stickyStateProvider) {
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
        deepStateRedirect: true,
        sticky: true,
        views: {
          '': {
            templateUrl: 'views/switch.html',
            controller: 'SwitchCtrl'
          },
          'config@switch': {
            templateUrl: 'views/fgswitch.html'
          }
        }
      })
      .state('switch.tables', {
        url: '/table',
        template: '<fg-switch-tables/>'
      })
      .state('switch.datapath', {
        url: '/datapath',
        templateUrl: 'views/switch/datapath.html',
        controller: 'DpCtrl'
      })
      .state('switch.ports', {
        url: '/ports',
        template: '<fg-switch-ports/>'
      })
      .state('switch.groups', {
        url: '/groups',
        templateUrl: 'views/switch/groups.html'
      })
      .state('switch.meters', {
        url: '/meters',
        templateUrl: 'views/switch/meters.html'
      })
      .state('simulation', {
        deepStateRedirect: true,
        sticky: true,
        views: {
          '': {
            url: '/simulation',
            templateUrl: 'views/simulation.html',
            controller: 'Simulation2Ctrl as SimCtrl'
          },
          'controls@simulation': {
            templateUrl: 'views/simulation/controls.html'
          },
          'stages@simulation': {
            template: '<ui-view/>'
          }
        }
      })
      .state('simulation.stages', {
        abstract: true,
        template: '<ui-view/>'
      })
      .state('simulation.stages.setup', {
        url: '/simulation',
        templateUrl: 'views/simulation/setup.html',
        controller: 'SimSetupCtrl as SimSetupCtrl'
      })
      .state('simulation.stages.arrival', {
        templateUrl: 'views/simulation/arrival.html'
      })
      .state('simulation.stages.extraction', {
        templateUrl: 'views/simulation/extraction.html'
      })
      .state('simulation.stages.choice', {
        templateUrl: 'views/simulation/choice.html'
      })
      .state('simulation.stages.selection', {
        templateUrl: 'views/simulation/selection.html'
      })
      .state('simulation.stages.execution', {
        templateUrl: 'views/simulation/execution.html'
      })
      .state('simulation.stages.groups', {
        templateUrl: 'views/simulation/groups.html'
      })
      .state('simulation.stages.egress', {
        templateUrl: 'views/simulation/egress.html'
      })
      .state('simulation.stages.final', {
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
