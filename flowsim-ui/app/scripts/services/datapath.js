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
  if(datapath && datapath instanceof Datapath) {
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};



});
