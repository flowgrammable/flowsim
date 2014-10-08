'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Packet', function Packet(Subscriber) {

    this.get = function(callback) {
      Subscriber.request('get', 'packet', {}, function(err, result) {
        callback(err, result);
      });
    };

    this.create = function(name) {
    };

    this.add = function(name) {

      // Add the name
      this.names[name] = true;
      packets.push(name);
    };

    this.del = function(pos) {
      var tmp;
       // Validate the array position
      if(pos >= -1 && pos < this.packets.length) {
        // remove the references
        tmp = this.packets.splice(pos, 1);
        if(tmp.name in this.names) {
          delete this.names[tmp.name];
        }
      }
    };

    this.save = function(name) {
    };

  });
