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
      if(!(type in cache)) { cache[type] = {}; }

      if(name in cache[type]) {
        callback(null, cache[type][name]);
      } else {
        Subscriber.httpGet('/api/'+type+'/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            cache[type][name] = result;
            cache[type][name].remote = true;
            //Protocols.attachPacket(result);
            callback(null, result);
          }
        });
      }
    }

    function getNames(type, callback) {
      // initialize the cache
      if(!(type in cache)) { cache[type] = {}; }

      console.log('type: ' + typeof(cache[type]));

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
      cache[type][name].local = true;
      cache[type][name].dirty = true;
      return cache[type][name];
    }

    function destroy(type, name) {
      // initialize the cache
      if(!(type in cache)) { cache[type] = {}; }

      // was never saved
      if(cache[type][name].local) {
        delete cache[type][name];
        return false;
      } else {
        cache[type][name].dirty   = true;
        cache[type][name].destroy = true;
        return true;
      }
    }

    function save(callback) {
      _.each(cache, function(_cache, type) {
        _.each(_cache, function(value, key) {
          if(value.dirty) {
            if(value.local) {
              Subscriber.httpPost('/api/'+type+'/'+key, value, 
                                  function(err, result) {
                if(err) {
                  callback(err);
                } else {
                  value.dirty = false;
                  value.local = false;
                  value.remote = true;
                  callback(null);
                }
              });
            } else if(value.remote) {
              Subscriber.httpUpdate('/api/'+type+'/'+key, value, 
                                    function(err, result) {
                if(err) {
                  callback(err);
                } else {
                  value.dirty = false;
                  callback(null);
                }
              });
            } else if(value.destroy) {
              Subscriber.httpDelete('/api/'+type+'/'+key, {}, 
                                    function(err, result) {
                if(err) {
                  callback(err);
                } else {
                  delete cache[type][key];
                  callback(null);
                }
              });
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
