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
  this.bytes = 0;
  this.protocols = [];
}

Packet.prototype.push = function(protocol) {
  this.protocols.push(protocol);
  this.bytes += protocol.bytes;
};

Packet.prototype.pop = function() {
  if(this.protocols.length === 0)
    return;

  this.bytes -= this.protocols[this.protocols.length-1].bytes;
  this.prototocols.splice(this.protocols.length-1);
};

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
