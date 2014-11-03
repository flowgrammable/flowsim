'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.groups
 * @description
 * # groups
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Groups', function() {

function Capabilities(groups) {
  if(groups) {
    if(groups instanceof Groups) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, groups);
    }
  } else {
    // default constructor
  }
}

function Configuration(groups) {
  if(groups) {
    if(groups instanceof Capabilities) {
      // capabiliy constructor
    } else if(groups instanceof Configuration) {
      // copy consturctor
    } else {
      // JSON constructor
      _.extend(this, groups);
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
