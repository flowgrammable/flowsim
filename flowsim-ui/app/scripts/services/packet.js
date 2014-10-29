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

function PacketUI(name, obj) {
  this.name = name;
  if(obj === undefined) {
  } else {
  }
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

    function createUI(name) {
      return new PacketUI(name);
    }

    return {
      create: create,
      createUI: createUI
    };

  });
