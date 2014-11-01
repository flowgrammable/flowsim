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
  .filter('takeObject', function () {
    return function (input, idx, beg, end) {
      var keys, result, interval;
      console.log('--');
      console.log(input);
      console.log(idx);
      console.log(beg);
      console.log(end);
      console.log('--');
      if(angular.isObject(input) && angular.isNumber(idx) && 
         angular.isNumber(beg) && angular.isNumber(end) && 0 <= beg && 
         beg <= end && end <= input.length) {
        keys = Object.keys(input);
        interval = keys.length * beg / end;
        console.log('key: ' + keys);
        console.log('interval: ' + interval);
        console.log(idx*interval);
        result = {};
        _.each(keys.slice(idx*interval, interval), function(key) {
          console.log(input[key]);
          result[key] = input[key];
        });
        return result;
      } else {
        return input;
      }
    };
  });
