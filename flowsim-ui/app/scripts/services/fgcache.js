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

    var post    = {};
    var update  = {};
    var destroy = {};

    var dirty = false;

    /*
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
    */

    function get(type, name, service, callback) {
      // initialize the cache
      if(!(type in update)) { update[type] = {}; }

      if(name in update[type]) {
        callback(null, udpate[type][name]);
      } else {
        Subscriber.httpGet('/api/'+type+'/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            update[type][name] = result;
            update[type][name+'UI'] = service.createUI(name, result);
            callback(null, result);
          }
        });
      }
    }

    function getNames(type, callback) {
      // initialize the cache
      if(!(type in update)) { update[type] = {}; }

      itf(Object.keys(update[type]).length) {
        callback(null, Object.keys(update[type]));
      } else {
        Subscriber.httpGet('/api/'+type, {}, function(err, result) {
          callback(err, result);
        });
      }
    }

    function create(type, name, service) {
      // initialize the cache
      if(!(type in post)) { post[type] = {}; }

      post[type][name] = service.create(name);
      post[type][name+'UI'] = service.createUI(name);
      dirty = true;
      return post[type][name+'UI'];
    }

    function destroy(type, name) {
      // initialize the cache
      if(!(type in post))    { post[type] = {}; }
      if(!(type in update))  { update[type] = {}; }
      if(!(type in destroy)) { destroy[type] = {}; }

      // was never saved
      if(post[type][name]) {
        delete post[type][name];
        delete post[type][name+'UI'];
      } else if(update[type][name]) {
        destroy[type][name] = update[type][name];
        delete update[type][name];
        delete update[type][name+'UI'];
      } else {
        destroy[type][name] = post[type][name];
        delete post[type][name];
        delete post[type][name+'UI'];
      }
    }

    function save(callback) {
      dirty = false;
      _.each(post, function(_post, type) {
        _.each(post, function(value, key) {
            Subscriber.httpPost('/api/'+type+'/'+key, value, 
                                function(err, result) {
              if(err) {
                dirty       = true;
                callback(err);
              } else {
                value.dirty = false;
                update[type][key] = post[type][key];
                update[type][key+'UI'] = post[type][key+'UI'];
                delete post[type][key];
                delete post[type][key+'UI'];
                callback(null);
              }
            });
        });
      });
      _.each(update, function(_update, type) {
        _.each(_update, function(value, key) {
          if(value.dirty) {
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
      _.each(destroy, function(_destroy, type) {
        _.each(_destroy, function(value, key) {
          Subscriber.httpDelete('/api/'+type+'/'+key, {},
                                function(err, result) {
            if(err) {
              dirty = true;
              callback(err);
            } else {
              delete destroy[type][key];
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
