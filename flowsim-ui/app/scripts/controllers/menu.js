'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('MenuCtrl', function ($scope, $rootScope, Subscriber, fgCache) {
    $scope.authenticated = true;
    $scope.dirty = false;

    $rootScope.$on('subscriberAuth', function() {
      console.log('auth');
      $scope.authenticated = true;
    });

    $rootScope.$on('subscriberDeauth', function() {
      console.log('deauth');
      $scope.authenticated = false;
    });

    $scope.save = function() {
      fgCache.save();
    }

    $rootScope.$on('dirtyCache', function() {
      console.log('dirtyCache');
      $scope.dirty = true;
    });
    
    $rootScope.$on('cleanCache', function() {
      console.log('cleanCache');
      $scope.dirty = false;
    });

    $scope.logout = function() {
      $scope.authenticated = false;
      Subscriber.logout(function(err) {
        if(err) {
          console.log(err.details);
        }
      });
    };
  });
