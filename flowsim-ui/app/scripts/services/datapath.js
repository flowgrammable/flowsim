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

var descLen   = 256;
var serialLen = 32;

var defMfrDesc   = 'Flowgrammable';
var defHwDesc    = 'Flowsim, OpenFlow Dataplane Simulator';
var defSwDesc    = 'Flowsim, OpenFlow Dataplane Simulator';
var defSerialNum = '0.1';
var defDpDesc    = 'Flowsim, OpenFlow Dataplane Simulator';

var defMissSendLen  = 100;

var _normal = 'Normal';
var _drop = 'Drop';
var _reassemble = 'Reassemble';

var defFrag = _normal;
var _fragOptions = [
  _normal,
  _drop,
  _reassemble
];

function Profile(datapath, dp_id) {
  if(_.isObject(datapath)) {
    _.extend(this, datapath);
  } else {
    if(dp_id) {
      this.datapath_id = dp_id;
    } else {
      this.datapath_id = (_(8).times(function() { 
        return UInt.padZeros(_.random(0, 255).toString(16), 2);
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
    this.capabilities = new Profile(datapath.capabilities);
  } else {
    // Copy the profile
    this.capabilities = new Profile(profile);
    // Default the basic operations
    this.miss_send_len = defMissSendLen;
    this.fragHandling  = defFrag;
  }
}

var TIPS = {
  datapath_id: 'Unique id of the datapath',
  ip_reassembly: 'Datapath can reassemble IP fragments',
  n_buffers: 'Number of packets that can be buffered for controller',
  miss_send_len: 'Prefix of packet in bytes to send to controller',
  mfr_description: '',
  hw_description: '',
  sw_description: '',
  serial_num: '',
  dp_description: ''
};

var TESTS = {
  datapath_id:     function() { return true; },
  n_buffers:       fgConstraints.isUInt(0, 0xffff),
  miss_send_len:   fgConstraints.isUInt(0, 0xffff),
  mfr_description: function(v) { return !v || v.length <= descLen; },
  hw_description:  function(v) { return !v || v.length <= descLen; },
  sw_description:  function(v) { return !v || v.length <= descLen; },
  serial_num:      function(v) { return !v || v.length <= serialLen; },
  dp_description:  function(v) { return !v || v.length <= descLen; }
};

return {
  Datapath: Datapath,
  Profile: Profile,
  TIPS: TIPS,
  TESTS: TESTS
};



});
