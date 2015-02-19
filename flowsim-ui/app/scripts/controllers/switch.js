'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchCtrl
 * @description
 * # SwitchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchCtrl', function ($scope, $state, fgCache, Profile, Switch,
                                      $rootScope, $modal, Regex) {
    $scope.names = {};
    $scope.device = null;

    $scope.getSwitches = function(callback) {
      fgCache.getNames('switch', callback);
    };

    $scope.addSwitch = function(name, callback) {
      if(name in $scope.names) {
        callback('Name exists');
      } else if(!Regex.Identifier.test(name)) {
        callback('Invalid name');
      } else {
        fgCache.getNames('profile', function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $modal.open({
              templateUrl: 'views/dialog/switch.html',
              controller: 'DialogSwitchCtrl',
              size: 'sm',
              resolve: {
                profiles: function () {
                  return result;
                }
              }
            }).result.then(function(profileName) {
              fgCache.get('profile', profileName, Profile, function(err, result) {
                if(err) {
                  console.log(err.details);
                } else {
                  $scope.device = fgCache.create('switch', name, Switch, result);
                  $scope.names[name] = true;
                  $scope.setDirty();
                  callback(null);
                }
              });
            });
          }
        });
      }
    };

    $scope.delSwitch = function(name) {
      fgCache.destroy('switch', name);
      if(fgCache.isDirty()) {
        $scope.setDirty();
      } else {
        $scope.setClean();
      }
      delete $scope.names[name];
    };

    $scope.setSwitch = function(name) {
      if(name === undefined) {
        $scope.device = null;
        $scope.$broadcast('setSwitch', null);
      } else {
        fgCache.get('switch', name, Switch, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $state.go('switch.datapath');
            $scope.device = result;
            $scope.$broadcast('setSwitch');
          }
        });
      }
    };

    $scope.setDirty = function() {
      if($scope.device){
        $scope.device.dirty = true;
      }
      $rootScope.$broadcast('dirtyCache');
    };

    $scope.setClean = function() {
      $rootScope.$broadcast('cleanCache');
    };

  });
