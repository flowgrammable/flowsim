'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfileCtrl', function ($scope, Profile) {

    $scope.names = {};
    $scope.profile = null;
    $scope.focus = 'datapath';

    $scope.addProfile = function(name) {
      if(name in $scope.names) {
        return 'Name exists';
      } else if(name.length == 0) {
        return 'Invalid name';
      } else {
        $scope.profile = Profile.create(name);
        $scope.names[name] = true;
        return '';
      }
    };

    $scope.delProfile = function(name) {
      Profile.destroy(name);
      delete $scope.names[name];
    };

    $scope.setProfile = function(name) {
      if(name === undefined) {
        $scope.profile = null;
        $scope.$broadcast('setProfile', null);
      } else {
        Profile.get(name, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.profile = result;
            $scope.$broadcast('setProfile', $scope.profile);
          }
        });
      }
    };

    // load the profile names we have
    Profile.getNames(function(err, result) {
      if(err) {
        $scope.errorMsg = err;
      } else {
        $scope.names = result;
        $scope.$broadcast('initList', _.map($scope.names, function(n) {
          return n.name;
        }));
      }
    });
  });
