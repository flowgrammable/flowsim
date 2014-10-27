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
    var switches = {};

    function get(name, callback) {
      if(name in switches) {
        callback(null, switches[name]);
      } else {
        Subscriber.httpGet('/api/switch/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            switches[name] = result;
            // attach
            callback(null, result);
          }
        });
      }
    }

    function getNames(callback) {
      if(Object.keys(switches).length) {
        callback(null, Object.keys(switches));
      } else {
        Subscriber.httpGet('/api/switch', {}, function(err, result) {
          callback(err, result);
        });
      }
    }

    function create(name) {
      switches[name] = {};
      switches[name].dirty = true;
      return switches[name];
    }

    function destroy(name) {
      delete switches[name];
      Subscriber.httpDelete('/api/switch/'+name, {}, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
        }
      });
    }

    function save() {
      _.each(switchess, function(value, key) {
        if(value.dirty) {
          Subscriber.httpUpdate('/api/switch/'+key, value,
                                function(err, result) {
            if(err) {
              console.log(err.details);
            } else {
              value.dirty = false;
            }
            });
        }
      });
    }

    return {
      get: get,
      getNames: getNames,
      create: create,
      destroy: destroy,
      save: save
    };
  });
