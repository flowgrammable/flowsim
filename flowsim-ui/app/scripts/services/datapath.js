'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.datapath
 * @description
 * # datapath
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('datapath', function() {

function Capabilities(datapath) {
  if(datapath) {
    if(datapath instanceof Datapath) {
      // Copy constructor
    } else {
      // JSON constructor
      _.extend(this, datapath);
    }
  } else {
    // default constructor
  }
}

function Configuration(datapath) {
  if(datapath) {
    if(datapath instanceof Capabilities) {
      // copy constructor
    } else if(datapath instanceof Configuration) {
    } else {
      // JSON constructor
      _.extend(this, datapath);
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
