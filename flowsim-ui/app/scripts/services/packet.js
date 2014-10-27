'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Packet', function(Subscriber, Protocols) {

    var packets = {};

    function get(name, callback) {
      if(name in packets) {
        callback(null, packets[name]);
      } else {
        Subscriber.httpGet('/api/packet/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            packets[name] = result;
            Protocols.attachPacket(result);
            callback(null, result);
          }
        });
      }
    };

    function getNames(callback) {
      Subscriber.httpGet('/api/packet', {}, function(err, result) {
        callback(err, result);
      });
    };

    function create(name) {
      packets[name] = Protocols.createPacket(name);
      packets[name].dirty = true;
      return packets[name];
    };

    function destroy(name) {
      delete packets[name];
      Subscriber.httpDelete('/api/packet/'+name, {}, function(err, result) {
        if(err) {
          console.log(err.details);
        } else {
        }
      });
    }

    function save() {
      _.each(packets, function(value, key) {
        if(value.dirty) {
          Subscriber.httpUpdate('/api/packet/'+key, value, 
                                function(err, result) {
            if(err) {
              console.log(err.details);
            } else {
              value.dirty = false;
            }
          });
        }
      });
    };

    return {
      get: get,
      getNames: getNames,
      create: create,
      destroy: destroy,
      save: save
    };

  });
