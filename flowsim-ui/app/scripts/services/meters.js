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
  if(meters) {
    if(meters instanceof Meters) {
    } else {
      _.extend(this, meters);
    }
  } else {
  }
}

function Configuration(meters) {
  if(meters) {
    if(meters instanceof Capabilities) {
    } else if(meters instanceof Configuration) {
    } else {
      _.extend(this, meters);
    }
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
