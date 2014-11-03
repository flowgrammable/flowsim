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
  if(ports) {
    if(ports instanceof Ports) {
      // copy constructor
    } else {
      _.extend(this, ports);
      // JSON constructor
    }
  } else {
    // default constructor
  }
}

function Configuration(ports) {
  if(ports) {
    if(ports instanceof Capabilities) {
      // capability constructor
    } else if(ports instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, ports);
    }
  } else {
    // default constructor
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
