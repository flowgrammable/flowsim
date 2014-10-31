'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('MenuCtrl', function ($scope, $rootScope, Subscriber, fgCache,
                                    $location, $modal, $route) {
    $scope.authenticated = true;
    $scope.dirty = false;
    $scope.prev_host = '';

    $rootScope.$on('subscriberAuth', function() {
      $scope.authenticated = true;
    });

    $rootScope.$on('subscriberDeauth', function() {
      $scope.authenticated = false;
    });

    $scope.save = function() {
      fgCache.save();
      $scope.dirty = false;
    }

    window.onbeforeunload = function(event) {
      if($scope.dirty) {
        return 'You have unsaved changes, are you sure you wish to leave without saving?';
      } else {
        return;
      }
    };

    $rootScope.$on('dirtyCache', function() {
      $scope.dirty = true;
    });

    $rootScope.$on('cleanCache', function() {
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
