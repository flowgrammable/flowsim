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
    } else {
      _.extend(this, datapath);
    }
  } else {
  }
}

function Configuration(datapath) {
  if(datapath) {
    if(datapath instanceof Capabilities) {
    } else if(datapath instanceof Configuration) {
    } else {
      _.extend(this, datapath);
    }
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};



});
