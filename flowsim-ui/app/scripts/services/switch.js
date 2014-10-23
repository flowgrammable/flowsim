'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.switch
 * @description
 * # switch
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Switch', function _switch() {
    var init = false;
    var names = [];
    var switches = {};
    return {
      create: function(name) {
        switches[name] = {
          name: name
        };
      },
      destroy: function(name) {
        if(name in switches) {
          delete switches[name];
        }
      },
      get: function(name) {
        return name in switches ? switches[name] : null;
      },
      getNames: function(callback) {
        if(!init) {
          names = [];
          init = true;
        }
        callback(null, names);
      },
      save: function(callback) {
      }
    };
  });
