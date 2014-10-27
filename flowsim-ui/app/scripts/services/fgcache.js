'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.fgCache
 * @description
 * # fgCache
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('fgCache', function(Subscriber) {

    var cache = {};


    function get(type, name, callback) {
      // initialize the cache
      if(!type in cache) { cache[type] = {}; }

      if(name in cache[type]) {
        callback(null, cache[type][name]);
      } else {
        Subscriber.httpGet('/api/'+type'/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            cache[type][name] = result;
            //Protocols.attachPacket(result);
            callback(null, result);
          }
        });
      }
    }

    function getNames(type, callback) {
      // initialize the cache
      if(!type in cache) { cache[type] = {}; }

      if(Object.keys(cache[type]).length) {
        callback(null, Object.keys(cache[type]));
      } else {
        Subscriber.httpGet('/api/'+type, {}, function(err, result) {
          callback(err, result);
        });
      }
    }

    function create(type, name, service) {
      // initialize the cache
      if(!type in cache) { cache[type] = {}; }

      cache[type][name] = service.create(name);
      cache[type][name].dirty = true;
      return cahce[type][name];
    }

    function destroy(type, name) {
      // initialize the cache
      if(!type in cache) { cache[type] = {}; }

      delete cache[type][name];
      Subscriber.httpDelete('/api/'+type+'/'+name, {}, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
        }
      });
    }

    function save() {
      // initialize the cache
      if(!type in cache) { cache[type] = {}; }

      _.each(cache, function(_cache, type) {
        _.each(_cache, function(value, key) {
          if(value.dirty) {
            Subscriber.httpUpdate('/api/'+type+'/'+key, value, 
                                  function(err, result) {
              if(err) {
                console.log(err.details);
              } else {
                value.dirty = false;
              }
          }
        });
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
