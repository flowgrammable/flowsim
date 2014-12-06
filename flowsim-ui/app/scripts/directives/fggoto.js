'use strict';

var singlePattern = /^[0-9]+$/;
var doublePattern = /^([0-9]+)(\.\.([0-9]+))$/;

function isSingle(v) {
  var val;
  if(!singlePattern.test(v)) { return false; }
  val = parseInt(v);
  return 0 < val && val < 255;
}

function getSingle(v) {
  var val;
  if(!isSingle(v)) { throw 'Bad Goto single pattern: '+v; }
  val = parseInt(v);
  return [val, val];
}

function isDouble(v) {
  var vals, first, second;
  if(!doublePattern.test(v)) { return false; }
  vals = v.split('..');
  first = parseInt(vals[0]);
  second = parseInt(vals[1]);
  return 0 < first && first < second && second < 255;
}

function getDouble(v) {
  var vals;
  if(!isDouble(v)) { throw 'Bad Goto double pattern: '+v; }
  vals = v.split('..');
  return [parseInt(vals[0]), parseInt(vals[1])];
}

angular.module('flowsimUiApp')
  .directive('fgGoto', function () {
    return {
      templateUrl: 'views/fggoto.html',
      restrict: 'E',
      scope: {
        set: '='
      },
      controller: function($scope) {
        // Build the controls section
        $scope.goto_ = {
          value: '',
          tip: 'Table Id or range of table Id(s) that can be targets',
          test: function(v) { return isSingle(v) || isDouble(v); }
        };

        $scope.add = function() {
          var target;
          // Build the target set
          if(isSingle($scope.goto_.value)) {
            target = getSingle($scope.goto_.value);
          } else {
            target = getDouble($scope.goto_.value);
          }
          // Don't allow overlapping sets
          if(_($scope.set).every(function(pair) {
            return target[1] < pair[0] || pair[1] < target[0];
          })) {
            $scope.set.push(target);
            $scope.goto_.value = '';
          }
        };

        // Pop the indicated set
        $scope.del = function(index) {
          $scope.set.splice(index, 1);
        };
      }
    };
  });
