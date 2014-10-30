'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('MenuCtrl', function ($scope, $rootScope, Subscriber, fgCache, $location) {
    $scope.authenticated = true;
    $scope.dirty = false;

    $rootScope.$on('subscriberAuth', function() {
      $scope.authenticated = true;
    });

    $rootScope.$on('subscriberDeauth', function() {
      $scope.authenticated = false;
    });

    $scope.save = function() {
      fgCache.save();
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
      var url = document.createElement('a');
      url.href = next;
      console.log('current: ' + $location.host());
      console.log('next: ' + url.hostname);
      if($scope.dirty && url.hostname !== $location.host()) {
        console.log('going to prevent default');
        event.preventDefault();
      } else {
        console.log('not going to prevent default');
      }
    });

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
