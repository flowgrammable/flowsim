'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Packet', function(Protocols) {

    function create(name) {
      return new Protocols.createPacket(name);
    }

    function createUI(name) {
      return new Protocols.createUI();
    }

    return {
      create: create,
      createUI: createUI
    };

  });
