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
  if(datapath && datapath instanceof Datapath) {
  } else {
  }
}

function Configuration(datapath) {
  if(datapath) {
    if(datapath instanceof Capabilities) {
    } else if(datapath instanceof Configuration) {
    }
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};



});
