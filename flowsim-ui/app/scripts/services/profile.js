'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.profile
 * @description
 * # profile
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Profile', function profile() {
    var init = false;
    var names = [];
    var profiles = {};
    return {
      create: function(name) {
        profiles[name] = {
          name: name
        };
        return profiles[name];
      },
      destroy: function(name) {
        if(name in profiles) {
          delete profiles[name];
        }
      },
      get: function(name) {
        return name in profiles ? profiles[name] : null;
      },
      getNames: function(callback) {
        if(!init) {
          // get teh list from server
          //names = result;
          names = [];
          init = true;
        }
        callback(null, names);
      },
      save: function(callback) {

      }
    };
  });
