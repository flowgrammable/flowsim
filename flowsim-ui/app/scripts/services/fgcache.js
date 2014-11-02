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

    var post    = {};     // (base,UI) ready for HTTP POST
    var update  = {};     // (base,UI) ready for HTTP UPDATE
    var _delete = {};     // base ready for HTTP DELETE

    /* get - retrieve a list of names from the cahce or server */
    function get(type, name, service, callback) {

      // Initialize the retrievable caches
      if(!(type in post))   { post[type] = {}; }
      if(!(type in update)) { update[type] = {}; }

      //  Return the object if local or get from server
      if(name in post[type]) {
        callback(null, post[type][name]);
      } else if(name in update[type]) {
        callback(null, update[type][name]);
      } else {
        Subscriber.httpGet('/api/'+type+'/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            update[type][name] = service.createUI(result);
            callback(null, update[type][name]);
          }
        });
      }
    }

    function getNames(type, callback) {
      var result;
      // initialize the cache
      if(!(type in post))   { post[type]   = {}; }
      if(!(type in update)) { update[type] = {}; }

      if(Object.keys(update[type]).length) {
        result = Object.keys(post[type]);
        console.log('what is this: '+result.concat(Object.keys(update[type])));
        callback(null, result.concat(Object.keys(update[type])));
      } else {
        Subscriber.httpGet('/api/'+type, {}, function(err, result) {
          if(err) {
            callback(null, Object.keys(post[type]));
          } else {
            callback(null, Object.keys(post[type]).concat(result.names));
           }
        });
      }
    }

    function create(type, name, service) {
      // initialize the cache
      if(!(type in post)) { post[type] = {}; }

      post[type][name] = service.createUI(name);
      post[type][name].dirty = true;
      return post[type][name];
    }

    function destroy(type, name) {
      // initialize the cache
      if(!(type in post))    { post[type] = {}; }
      if(!(type in update))  { update[type] = {}; }
      if(!(type in _delete)) { _delete[type] = {}; }

      // was never saved
      if(post[type][name]) {
        delete post[type][name];
      } else if(update[type][name]) {
        //dirty = true;
        _delete[type][name] = update[type][name];
        delete update[type][name];
      }
    }

    function isDirty() {
      var postDirty, updateDirty, deleteDirty;

      // If there is anything to post we are dirty
      postDirty = _.some(post, function(type) {
        return Object.keys(type).length > 0;
      });

      // If there is any update that is dirty we are dirty
      updateDirty = false;
      _.each(update, function(_update, type) {
        updateDirty = updateDirty || _.some(_update, function(value) {
          return value.dirty;
        });
      });

      // If there is anything to delete we are dirty
      deleteDirty = _.some(_delete, function(type) {
        return Object.keys(type).length > 0;
      });

      // If anything is dirty the cache is dirty
      return postDirty || updateDirty || deleteDirty;
    }

    function save() {
      //dirty = false;
      _.each(post, function(_post, type) {
        _.each(_post, function(value, key) {
          var obj = post[type][key].toBase();
            Subscriber.httpPost('/api/'+type+'/'+key, obj,
                                function(err) {
              if(err) {
                console.log(err.details);
              } else {
                update[type][key] = post[type][key];
                update[type][key].dirty = false;
                delete post[type][key];
              }
            });
        });
      });
      _.each(update, function(_update, type) {
        _.each(_update, function(value, key) {
          var obj;
          if(update[type][key].dirty) {
            obj = update[type][key].toBase();
            Subscriber.httpUpdate('/api/'+type+'/'+key, obj,
                                  function(err) {
              if(err) {
                console.log(err.details);
              } else {
                update[type][key].dirty = false;
              }
            });
          }
        });
      });
      _.each(_delete, function(__delete, type) {
        _.each(__delete, function(value, key) {
          Subscriber.httpDelete('/api/'+type+'/'+key, {},
                                function(err) {
            if(err) {
              console.log(err.details);
            } else {
              delete _delete[type][key];
            }
          });
        });
      });
    }

    function clear() {
      post = {};
      update = {};
      _delete = {};
    }

    return {
      get: get,
      getNames: getNames,
      create: create,
      destroy: destroy,
      isDirty: isDirty,
      save: save,
      clear: clear
    };
  });
