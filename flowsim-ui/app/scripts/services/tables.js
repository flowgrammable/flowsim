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
      // copy constructor
    } else {
      _.extend(this, tables);
      // JSON constructor
    }
  } else {
    // default constructor
  }
}

function Configuration(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      // capability constructor
    } else if(tables instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, tables);
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
