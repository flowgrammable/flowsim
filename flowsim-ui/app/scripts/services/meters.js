'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.meters
 * @description
 * # meters
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('meters', function() {

function Capabilities(meters) {
  if(meters && meters instanceof Meters) {
  } else {
  }
}

function Configuration(meters) {
  if(meters) {
    if(meters instanceof Capabilities) {
    } else if(meters instanceof Configuration) {
    }
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
