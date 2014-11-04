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
    if(meters instanceof Capabilities) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, meters);
    }
  } else {
    // default constructor
  }
}

Capabilities.prototype.openflow_1_0 = function() {
};
       
Capabilities.prototype.openflow_1_1 = function() {
};   

Capabilities.prototype.openflow_1_2 = function() {
};

Capabilities.prototype.openflow_1_3 = function() {
};

Capabilities.prototype.openflow_1_4 = function() {
};

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
