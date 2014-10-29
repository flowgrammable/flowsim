'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */

function Packet(name) {
  this.name = name;
}

function PacketUI(pkt) {
  this.name = pkt.name;
}

PacketUI.prototype.toBase = function() {
  var result = new Packet(this.name);
  // do sutff
  return result;
}

angular.module('flowsimUiApp')
  .factory('Packet', function(Protocols) {

    function create(name) {
      return new Packet(name);
    }

    function createUI(pkt) {
      return new PacketUI(pkt);
    }

    return {
      create: create,
      createUI: createUI
    };

  });
