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
  if(meters && meters instanceof Meters) {
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
