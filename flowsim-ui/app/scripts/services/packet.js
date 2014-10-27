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

    // how is this differnet than this.get?
    function getDetail(packetName, callback){
      Subscriber.httpGet('/api/packet/'+packetName, {}, function(err, result){
        callback(err, result);
      });
    };

    function get(name, callback) {
      if(name in this.packets) {
        callback(null, this.packets[name]);
      } else {
        Subscriber.httpGet('/api/packet/'+name, {}, function(err, result) {
          if(err) {
            callback(err);
          } else {
            this.packets[name] = result;
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
    }

    function save(name) {
    };

    return {
      get: get,
      getNames: getNames,
      create: create,
      destroy: destroy,
      save: save
    };

  });
