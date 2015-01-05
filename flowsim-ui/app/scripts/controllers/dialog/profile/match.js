'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogProfileMatchCtrl
 * @description
 * # DialogProfileMatchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogProfileMatchCtrl', function ($scope, $modalInstance, 
                                                  match, tableName, tableId, Noproto) {
    $scope.match     = match;
    $scope.tableName = tableName;
    $scope.tableId   = tableId;


    $scope.tip = function(protocol, tip, type){
      return Noproto.MatchTips(protocol, tip, type);
    };

    $scope.ok = function() {
      $modalInstance.close($scope.match);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
