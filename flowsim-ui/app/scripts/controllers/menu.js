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
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
      var nextUrl, curUrl, dialog;
      nextUrl = document.createElement('a');
      curUrl = document.createElement('a');
      nextUrl.href = next;
      curUrl.href = current;

      if($scope.prev_host.length && $scope.dirty &&
         (curUrl.host !== nextUrl.host)) {
        event.preventDefault();
        dialog = $modal.open({
          templateUrl: 'views/dialog/unsaved.html',
          controller: 'DialogUnsavedCtrl',
          size: 'sm'
        });
        dialog.result.then(function () {
          $location.url(next);
          $route.reload();
        });
      }
      else if($scope.prev_host.length === 0) {
        $scope.prev_host = nextUrl.hostname;
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
