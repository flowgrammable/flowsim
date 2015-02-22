'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('MenuCtrl', function ($scope, $rootScope, $location, Subscriber, fgCache) {
    //$scope.authenticated = true;
    $scope.authenticated = Subscriber.authenticated();
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
    };

    window.onbeforeunload = function() {
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

    $scope.destroySession = function() {
      $location.url('/#');
      $scope.authenticated = false;
      fgCache.clear();
      Subscriber.logout(function(err) {
        if(err) {
          console.log(err.details);
        }
      });
    };

    $scope.logout = function() {
      if($scope.dirty){
        if(window.confirm('You have unsaved changes that will not be saved on logout.')){
          $scope.destroySession();
        }
      } else {
        $scope.destroySession();
      }
    };
  });
