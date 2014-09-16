
var flogWidgets = angular.module('flogWidgets');

flogWidgets.directive('ioList', function() {
  return {
    restrict: 'E',
    templateUrl: 'ioList.html'
  };
});

flogWidgets.controller('ioListCtrl', function($scope, $rootScope) {

  var identPattern = /[a-zA-Z_][a-zA-Z0-9_]*/;
  var names = {};

  $scope.itemName = '';
  $scope.items = [];
  $scope.focus = -1;
  $scope.errorOccured = false;
  $scope.errorMessage = '';

  var clearInput = function() {
    $scope.itemName = '';
    $scope.errorOccured = false;
    $scope.errorMessage = '';
  }

  var reportError = function(msg) {
    $scope.errorOccured = true;
    $scope.errorMessage = msg;
  }

  // House keeping for shifting foucs
  $scope.shiftFocus = function(index) {
    if($scope.focus != pos) {
      $scope.focus = pos;
      $rootScope.broadcast('changed item');
    }

  $scope.addItem = function() {
    if(!identPattern.test($scope.itemName)) {
      reportError('Invalid name');
    } else if($scope.itemName in names) {
      reportError('Name exists');
    } else {
      names[$scope.itemName] = true;
      $scope.items.push($scope.itemName);
      shiftFocus($scope.items.length-1);
      clearInput();
      $rootScope.broadcast('new item');
    }
  }

  $scope.delItem = function(index) {
    var item = null;
    if(index <= $scope.focus) {
      $scope.shiftFocus(index-1);
    }
    item = $scope.items.splice(index, 1);
    delete names[item];
  }

});

