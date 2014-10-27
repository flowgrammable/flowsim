'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Packet', function Packet(Subscriber, Protocols) {

    this.packets = {};

    // how is this differnet than this.get?
    this.getDetail = function(packetName, callback){
      Subscriber.httpGet('/api/packet/'+packetName, {}, function(err, result){
        callback(err, result);
      });
    };

    this.get = function(name, callback) {
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

    this.getNames = function(callback) {
      Subscriber.httpGet('/api/packet', {}, function(err, result) {
        callback(err, result);
      });
    };

    this.create = function(name) {
      this.packets[name] = Protocols.createPacket(name);
      this.packets[name].dirty = true;
      return this.packets[name];
    };

    this.destroy = function(name) {
      delete this.packets[name];
    }

    this.save = function(name) {
    };

  });
