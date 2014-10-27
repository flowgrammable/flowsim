'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchCtrl
 * @description
 * # SwitchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchCtrl', function ($scope, Switch) {
    $scope.names = {};
    $scope._switch = null;
    $scope.focus = 'datapath';

    $scope.getSwitches = function(callback) {
      Packet.getNames(callback);
    };

    $scope.addSwitch = function(name) {
      if(name in $scope.names) {
        return 'Name exists';
      } else if(name.length == 0) {
        return 'Invalid name'; 
      } else { 
        $scope._switch = Switch.create(name);
        $scope.names[name] = true;
        return '';
      }
    };

    $scope.delSwitch = function(name) {
      Switch.destroy(name);
      delete $scope.names[name];
    };

    $scope.setSwitch = function(name) {
      if(name === undefined) {
        $scope._switch = null;
        $scope.$broadcast('setSwitch', null);
      } else {
        Switch.get(name, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope._switch = result;
            $scope.$broadcast('setSwitch', $scope._switch);
          }
        });
      }
    };

  });

