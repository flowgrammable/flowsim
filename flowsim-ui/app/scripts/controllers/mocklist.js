'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MocklistCtrl
 * @description
 * # MocklistCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('mockListCtrl', function ($scope) {

    $scope.mockNames = {};
    $scope.mockGet = function(callback){
      callback(null, _($scope.mockNames).keys());
    }; 

    $scope.mockSet = function(name){
      console.log('has been set: '+name);
    };

    $scope.mockDel = function(name){
      if(!$scope.mockNames[name]){
        callback('name: '+name+' doesnt exist');
      } else {
        delete $scope.mockNames[name];
      }
    };

    $scope.mockAdd = function(name, callback){
      if(!$scope.mockNames[name]){
        $scope.mockNames[name] = true;
        callback(null);
      } else if($scope.mockNames[name]){
        callback('name: '+name+'exists');
      }
    };
  
  });
