'use strict';

/**
 * @ngdoc filter
 * @name flowsimUiApp.filter:capabilities
 * @function
 * @description
 * # capabilities
 * Filter in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .filter('fgSelect', function () {
    return function (input, enabled) {
      var result = [];
      if(angular.isArray(input) && angular.isObject(enabled)) {
        _.each(input, function(val) {
          if(typeof val === 'string' && enabled[val]) {
            result.push(val);
          } else if(angular.isObject(val) && enabled[val.value]) {
            result.push(val);
          } 
        });
        return result;
      } else {
        return input;
      }
      return 'capabilities filter: ' + input;
    };
  });
