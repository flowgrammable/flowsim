'use strict';

/**
 * @ngdoc filter
 * @name flowsimUiApp.filter:take
 * @function
 * @description
 * # take
 * Filter in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .filter('take', function () {
    return function (input, beg, end) {
      if(angular.isArray(input) && angular.isNumber(beg) && 
         angular.isNumber(end) && 0 <= beg && beg <= end && 
         end <= input.length) {
        return input.slice(beg, end);
      } else {
        return input;
      }
    };
  });
