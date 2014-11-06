'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.meters
 * @description
 * # meters
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Meters', function(fgConstraints) {

var defaultMaxMeters = 10;
var defaultMaxBands = 10;
var defaultMaxColor = 10;

var Meters = {};

Meters.TIPS = {
  max_meters: 'Maximum number of meters',
  stats: 'Meter stats capability',
  dropband: 'Drop packet',
  dscpband: 'Remark DSCP in the IP header',
  max_bands: 'Maximum bands per meter',
  max_color: 'Maximum color value'
};

Meters.TESTS = {
  max_meters: fgConstraints.isUInt(0, 0xffffffff),
  max_bands: fgConstraints.isUInt(0, 0xff),
  max_color: fgConstraints.isUInt(0, 0xff)
}

function Capabilities(meters) {
  if(meters) {
    _.extend(this, meters);
  } else {
    // default constructor
    this.max_meters = defaultMaxMeters;
    this.dropband = true;
    this.dscpband = true;
    this.max_bands = defaultMaxBands;
    this.max_color = defaultMaxColor;
    this.stats = true;
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
  Configuration: Configuration,
  TIPS: Meters.TIPS,
  TESTS: Meters.TESTS
};

});
