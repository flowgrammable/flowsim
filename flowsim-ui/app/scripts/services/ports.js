'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.ports
 * @description
 * # ports
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('ports', function() {

function Capabilities(ports) {
  if(ports && ports instanceof Ports) {
  } else {
  }
}

function Configuration(ports) {
  if(ports) {
    if(ports instanceof Capabilities) {
    } else if(ports instanceof Configuration) {
    }
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
