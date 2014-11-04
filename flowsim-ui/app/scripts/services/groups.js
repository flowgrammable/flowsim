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
    if(groups instanceof Capabilities) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, groups);
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
