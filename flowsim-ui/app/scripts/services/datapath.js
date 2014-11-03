'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.datapath
 * @description
 * # datapath
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Datapath', function(fgConstraints) {

function Capabilities(datapath) {
  if(datapath) {
    if(datapath instanceof Datapath) {
      // Copy constructor
      this.datapath_id     = datapath.datapath_id;
      this.ip_reassembly   = datapath.ip_reassembly;
      this.n_buffers       = datapath.n_buffers;
      this.mfr_description = datapath.mfr_description;
      this.hw_description  = datapath.hw_description;
      this.sw_description  = datapath.sw_description;
      this.serial_num      = datapath.serial_num;
      this.dp_description  = datapath.dp_description;
    } else {
      // JSON constructor
      _.extend(this, datapath);
    }
  } else {
    // default constructor
    this.datapath_id   = '01:23:45:67:89:ab'; // FIXME: bad default
    this.n_buffers     = 1024;
    this.ip_reassembly = true;
    // Descriptions
    this.mfr_description = '';
    this.hw_description  = '';
    this.sw_description  = '';
    this.serial_num      = '';
    this.dp_description  = '';
  }
}

Capabilities.prototype.openflow_1_0 = function() {
  this.ip_reassembly   = true;
  this.mfr_description = 'Flowgrammable';
  this.hw_description  = 'Generic OpenFlow 1.0 Switch';
  this.sw_description  = 'Generic OpenFlow 1.0 Software';
  this.dp_description  = 'Generic OpenFlow 1.0 Pipeline';
};

Capabilities.prototype.openflow_1_1 = function() {
  this.ip_reassembly   = true;
  this.mfr_description = 'Flowgrammable';
  this.hw_description  = 'Generic OpenFlow 1.1 Switch';
  this.sw_description  = 'Generic OpenFlow 1.1 Software';
  this.dp_description  = 'Generic OpenFlow 1.1 Pipeline';
};

Capabilities.prototype.openflow_1_2 = function() {
  this.ip_reassembly   = true;
  this.mfr_description = 'Flowgrammable';
  this.hw_description  = 'Generic OpenFlow 1.2 Switch';
  this.sw_description  = 'Generic OpenFlow 1.2 Software';
  this.dp_description  = 'Generic OpenFlow 1.2 Pipeline';
};

Capabilities.prototype.openflow_1_3 = function() {
  this.ip_reassembly   = true;
  this.mfr_description = 'Flowgrammable';
  this.hw_description  = 'Generic OpenFlow 1.3 Switch';
  this.sw_description  = 'Generic OpenFlow 1.3 Software';
  this.dp_description  = 'Generic OpenFlow 1.3 Pipeline';
};

Capabilities.prototype.openflow_1_4 = function() {
  this.ip_reassembly   = true;
  this.mfr_description = 'Flowgrammable';
  this.hw_description  = 'Generic OpenFlow 1.4 Switch';
  this.sw_description  = 'Generic OpenFlow 1.4 Software';
  this.dp_description  = 'Generic OpenFlow 1.4 Pipeline';
};

function Configuration(datapath) {
  if(datapath) {
    if(datapath instanceof Capabilities) {
      // capability constructor
      this.capabilities = datapath;
    } else if(datapath instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, datapath);
    }
  } else {
    // default constructor
  }
}

var TIPS = {
  datapath_id: 'Unique id of the datapath',
  ip_reassembly: 'Datapath can reassemble IP fragments',
  n_buffers: 'Number of packets that can be buffered for controller',
  mfr_description: '',
  hw_description: '',
  sw_description: '',
  serial_num: '',
  dp_description: ''
};

var TESTS = {
  datapath_id:     function() { return true; },
  n_buffers:       fgConstraints.isUInt(0, 0xffff),
  mfr_description: function(v) { return !v || v.length <= 256 ; },
  hw_description:  function(v) { return !v || v.length <= 256; },
  sw_description:  function(v) { return !v || v.length <= 256; },
  serial_num:      function(v) { return !v || v.length <= 32; },
  dp_description:  function(v) { return !v || v.length <= 256; }
};

return {
  Capabilities: Capabilities,
  Configuration: Configuration,
  TIPS: TIPS,
  TESTS: TESTS
};



});
