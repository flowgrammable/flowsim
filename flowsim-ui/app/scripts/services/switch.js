'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.switch
 * @description
 * # switch
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Switch', function() {

    function create(name) {
      return {
        name: name
      };
    }

    return {
      create: create,
    };
  });
