'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.fgCache
 * @description
 * # fgCache
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('fgCache', function(Subscriber, $rootScope) {

    var cache = {};
    var flush = {};
    var dirty = false;

    function sync() {
      var state = true;
      _.each(cache, function(_cache, type) {
        _.each(_cache, function(value, key) {
          if(value.local || value.dirty) {
            state = false;
          }
        });
      });
      _.each(cache, function(_cache, type) {
        if(Object.keys(_cache).length) {
          state = false;
        }
      });
      return state;
    }

    function get(type, name, service, callback) {
      // initialize the cache
      if(!(type in cache)) { cache[type] = {}; }

      if(name in cache[type]) {
        callback(null, cache[type][name]);
      } else {
        Subscriber.httpGet('/api/'+type+'/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            cache[type][name] = result;
            //cache[type][name+'UI'] = service.createUI(name, result);
            callback(null, result);
          }
        });
      }
    }

    function getNames(type, callback) {
      // initialize the cache
      if(!(type in cache)) { cache[type] = {}; }

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
      if(!(type in cache)) { cache[type] = {}; }

      cache[type][name] = service.create(name);
      //cache[type][name+'UI'] = service.createUI(name);
      cache[type][name].local = true;
      dirty = true;
      return cache[type][name];
    }

    function destroy(type, name) {
      // initialize the cache
      if(!(type in cache)) { cache[type] = {}; }
      if(!(type in flush)) { flush[type] = {}; }

      // was never saved
      if(cache[type][name].local) {
        delete cache[type][name];
      } else {
        flush[type][name] = cache[type][name];
        delete cache[type][name];
      }
      if(sync()) {
        dirty = false;
      } else {
        dirty = true;
      }
    }

    function save(callback) {
      dirty = false;
      _.each(cache, function(_cache, type) {
        _.each(_cache, function(value, key) {
          if(value.local) {
            delete value.local;
            Subscriber.httpPost('/api/'+type+'/'+key, value, 
                                function(err, result) {
              if(err) {
                dirty = true;
                callback(err);
              } else {
                value.dirty = false;
                callback(null);
              }
            });
          } else if(value.dirty) {
            Subscriber.httpUpdate('/api/'+type+'/'+key, value,
                                  function(err, result) {
              if(err) {
                dirty = true;
                callback(err);
              } else {
                value.dirty = false;
                callback(null);
              }
            });
          }
        });
      });

      _.each(flush, function(_flush, type) {
        _.each(_flush, function(value, key) {
          Subscriber.httpDelete('/api/'+type+'/'+key, {},
                                function(err, result) {
            if(err) {
              dirty = true;
              callback(err);
            } else {
              callback(null);
            }
          });
        });
      });
    }

    return {
      sync: sync,
      get: get,
      getNames: getNames,
      create: create,
      destroy: destroy,
      save: save
    };
  });
