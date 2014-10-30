'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchCtrl
 * @description
 * # SwitchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchCtrl', function ($scope, fgCache, Switch) {
    $scope.names = {};
    $scope._switch = null;
    $scope.focus = 'datapath';
    $scope.dirty = false;

    $scope.getSwitches = function(callback) {
      fgCache.getNames('switch', callback);
    };

    $scope.addSwitch = function(name) {
      if(name in $scope.names) {
        return 'Name exists';
      } else if(name.length == 0) {
        return 'Invalid name'; 
      } else { 
        $scope._switch = fgCache.create('switch', name, Switch).ui;
        $scope.names[name] = true;
        $scope.dirty = true;
        return '';
      }
    };

    $scope.delSwitch = function(name) {
      fgCache.destroy('switch', name);
      delete $scope.names[name];
    };

    $scope.setSwitch = function(name) {
      if(name === undefined) {
        $scope._switch = null;
        $scope.$broadcast('setSwitch', null);
      } else {
        fgCache.get('switch', name, Switch, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope._switch = result.ui;
            $scope.$broadcast('setSwitch', $scope._switch);
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

