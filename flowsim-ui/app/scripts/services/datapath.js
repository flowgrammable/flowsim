'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.datapath
 * @description
 * # datapath
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Datapath', function(fgConstraints, UInt) {

var defBufferCount  = 1024;
var defIPReassembly = true;

var defMfrDesc   = 'Flowgrammable';
var defHwDesc    = 'Flowsim, OpenFlow Dataplane Simulator';
var defSwDesc    = 'Flowsim, OpenFlow Dataplane Simulator';
var defSerialNum = '0.1';
var defDpDesc    = 'Flowsim, OpenFlow Dataplane Simulator';

var defaultFragHandling = 'normal';
var defaultMissSendLen  = 100;

var fragOptions = [
  'normal',
  'drop',
  'reassemble'
];

function Profile(datapath, dp_id) {
  if(_.isObject(datapath)) {
    _.extend(this, datapath);
  } else {
    if(dp_id) {
      this.datapath_id = dp_id;
    } else {
      this.datapath_id = (_(8).times(function() { 
        return UInt.padZeros(_.random(0, 255)).toString(16);
      })).join(':');
    }
    this.n_buffers     = defBufferCount;
    this.ip_reassembly = defIPReassembly;

    // Descriptions
    this.mfr_description = defMfrDesc;
    this.hw_description  = defHwDesc;
    this.sw_description  = defSwDesc;
    this.serial_num      = defSerialNum;
    this.dp_description  = defDpDesc;
  }
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

Profile.prototype.getMACPrefix = function() {
  return this.datapath_id.slice(0, 11); 
};

Profile.prototype.ofp_1_0 = function() {};
Profile.prototype.ofp_1_1 = function() {};
Profile.prototype.ofp_1_2 = function() {};
Profile.prototype.ofp_1_3 = function() {};
Profile.prototype.ofp_1_4 = function() {};

function Datapath(datapath, profile) {
  if(_.isObject(datapath)) {
    _.extend(this, datapath);
    this.capabilities = _.clone(datapath.capabilities);
  } else {
      this.capabilities = {
        ip_reassembly : profile.ip_reassembly
      };

      this.datapath_id   = profile.datapath_id;
      this.n_buffers     = profile.n_buffers;
      this.miss_send_len = defaultMissSendLen;

      this.fragHandling = defaultFragHandling;

      this.mfr_description = profile.mfr_description;
      this.hw_description  = profile.hw_description;
      this.sw_description  = profile.sw_description;
      this.serial_num      = profile.serial_num;
      this.dp_description  = profile.dp_description;
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
  Capabilities: Profile,
  Configuration: Datapath,
  TIPS: TIPS,
  TESTS: TESTS
};



});
