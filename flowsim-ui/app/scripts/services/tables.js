'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.tables
 * @description
 * # tables
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('tables', function() {

function Capabilities(tables) {
  if(tables) {
    if(tables instanceof Tables) {
    } else {
      _.extend(this, tables);
    }
  } else {
  }
}

function Configuration(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
    } else if(tables instanceof Configuration) {
    } else {
      _.extend(this, tables);
    }
  } else {
  }
}

return {
  Capabilities: Capabilities,
  Configuration: Configuration
};

});
