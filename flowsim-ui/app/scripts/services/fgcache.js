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

    var post    = {};     // (base,UI) ready for HTTP POST
    var update  = {};     // (base,UI) ready for HTTP UPDATE
    var destroy = {};     // base ready for HTTP DELETE

    // Server synchronization state
    // ... from operations: create, update failure, delete 
    var dirty = false;   

    /* get - retrieve a list of names from the cahce or server
     */
    function get(type, name, service, callback) {

      // Initialize the retrievable caches
      if(!(type in post))   { post[type] = {}; }
      if(!(type in update)) { update[type] = {}; }

      //  Return the object if local or get from server
      if(name in post[type]) {
        callback(null, {
          base: post[type][name],
          ui: post[type][name+'UI']
        });
      } else if(name in update[type]) {
        callback(null, {
          base: update[type][name],
          ui: udpate[type][name+'UI']
        });
      } else {
        Subscriber.httpGet('/api/'+type+'/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            update[type][name] = result;
            update[type][name+'UI'] = service.createUI(name, result);
            callback(null, {
              base: update[type][name],
              ui: udpate[type][name+'UI']
            });
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

      post[type][name]      = service.create(name);
      post[type][name+'UI'] = service.createUI(name);
      post[type][name+'UI'].dirty = true;
      dirty = true;
      return {
        base: post[type][name+'UI'],
        ui: post[type][name+'UI']
      };
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
      } 
    }

    function save(callback) {
      dirty = false;
      _.each(post, function(_post, type) {
        _.each(post, function(value, key) {
          post[type][key] = post[type][key+'UI'].toBase();
            Subscriber.httpPost('/api/'+type+'/'+key, value, 
                                function(err, result) {
              if(err) {
                dirty = true;
                callback(err);
              } else {
                update[type][key] = post[type][key];
                update[type][key+'UI'] = post[type][key+'UI'];
                update[type][key+'UI'].dirty = false;
                delete post[type][key];
                delete post[type][key+'UI'];
                callback(null);
              }
            });
        });
      });
      _.each(update, function(_update, type) {
        _.each(_update, function(value, key) {
          if(update[type][key+'UI'].dirty) {
            update[type][key] = update[type][key+'UI'].toBase();
            Subscriber.httpUpdate('/api/'+type+'/'+key, update[type][key],
                                  function(err, result) {
              if(err) {
                dirty = true;
                callback(err);
              } else {
                update[type][key+'UI'].dirty = false;
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
