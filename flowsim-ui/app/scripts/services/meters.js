'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.meters
 * @description
 * # meters
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Meters', function() {

function Capabilities(meters) {
  if(meters) {
    if(meters instanceof Meters) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, meters);
    }
  } else {
    // default constructor
  }
}

function Configuration(meters) {
  if(meters) {
    if(meters instanceof Capabilities) {
      // capability constructor
    } else if(meters instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, meters);
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
