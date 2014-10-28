'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfileCtrl', function ($scope, fgCache, Profile) {

    $scope.names = {};
    $scope.profile = null;
    $scope.focus = 'datapath';
    $scope.dirty = false;

    $scope.set = function(idx) {
      Profile.setVersion($scope.profile, idx);
    };
    $scope.versions = [
      'OpenFlow 1.0',
      'OpenFlow 1.1',
      'OpenFlow 1.2',
      'OpenFlow 1.3',
      'OpenFlow 1.4'
    ];

    $scope.getProfiles = function(callback) {
      fgCache.getNames('profile', callback);
    };


    $scope.addProfile = function(name) {
      if(name in $scope.names) {
        return 'Name exists';
      } else if(name.length == 0) {
        return 'Invalid name';
      } else {
        $scope.profile = fgCache.create('profile', name, Profile);
        $scope.names[name] = true;
        $scope.dirty = true;
        return '';
      }
    };

    $scope.delProfile = function(name) {
      fgCache.destroy('profile', name);
      delete $scope.names[name];
      $scope.dirty = !fgCache.sync();
    };

    $scope.setProfile = function(name) {
      if(name === undefined) {
        $scope.profile = null;
        $scope.$broadcast('setProfile', null);
      } else {
        fgCache.get('profile', name, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.profile = result;
            $scope.$broadcast('setProfile', $scope.profile);
          }
        });
      }
    };

    $scope.save = function() {
      fgCache.save(function(err, result) {
        if(err) {
          $scope.dirty = true;
          console.log(err.details)
        } else {
          scope.dirty = false;
        }
      });
    };

  });
