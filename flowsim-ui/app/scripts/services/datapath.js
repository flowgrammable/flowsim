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

var _normal     = 'Normal';
var _drop       = 'Drop';
var _reassemble = 'Reassemble';

var defFrag = _normal;

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

function mkProfile(){
  return new Profile();
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

Profile.prototype.getMACPrefix = function() {
  return this.datapath_id.slice(0, 11);
};

Profile.prototype.toString = function(){
  return 'id:              '+this.datapath_id+'\n'+
         'n_buffers:       '+this.n_buffers+'\n'+
         'mfr_description: '+this.mfr_description+'\n'+
         'hw_description:  '+this.hw_description+'\n'+
         'sw_description:  '+this.sw_description+'\n'+
         'serial_num:      '+this.serial_num+'\n'+
         'dp_description:  '+this.dp_description;
};

Profile.prototype.ofp_1_0 = function() {};
Profile.prototype.ofp_1_1 = function() {};
Profile.prototype.ofp_1_2 = function() {};
Profile.prototype.ofp_1_3 = function() {};
Profile.prototype.ofp_1_4 = function() {};

function Buffer(buffer, limit) {
  if(_.isObject(buffer)) {
    _.extend(this, buffer);
    this.alloc = {};
    this.limit = buffer.limit;
    console.log('buff,', this);
  } else {
    this.alloc = {};
    this.limit = limit;
  }
}

Buffer.prototype.clone = function() {
  return new Buffer(this);
};

Buffer.prototype.request = function() {
  var id;
  for(id=0; id<this.limit; ++id) {
    if(!_(this.alloc).has(id.toString())) {
      this.alloc[id.toString()] = true;
      return id;
    }
  }
  throw 'Packet Buffer Exhaustion';
};

Buffer.prototype.release = function(id) {
  delete this.alloc[id.toString()];
};

Buffer.prototype.toBase = function(){
  return {
    limit: this.limit
  };
};

function Datapath(datapath, profile) {
  if(_.isObject(datapath)) {
    _.extend(this, datapath);
    this.capabilities = new Profile(datapath.capabilities);
    this.bufAllocator = new Buffer(datapath.bufAllocator);
  } else {
    // Copy the profile
    this.capabilities = new Profile(profile);
    // Default the basic operations
    this.miss_send_len = defMissSendLen;
    this.fragHandling  = defFrag;
    this.bufAllocator = new Buffer(null, this.capabilities.n_buffers);
  }
}

Datapath.prototype.toBase = function(){
  return {
    capabilities: this.capabilities,
    bufAllocator: this.bufAllocator.toBase(),
    miss_send_len: this.miss_send_len,
    fragHandling: this.fragHandling
  };
};

Datapath.prototype.ingress = function(packet) {
  var storeOrDrop;
  if(packet.fragment) {
    switch(this.fragHandling) {
      case _normal:
        storeOrDrop = false;
        break;
      case _drop:
        storeOrDrop = true;
        break;
      case _reassemble:
        // FIXME implement fragmentation reassembly behavior
        storeOrDrop = true;
        break;
      default:
        throw 'Bad fragmentation behavior'+this.fragHandling;
    }
  } else {
    storeOrDrop = false;
  }
  // Pipeline just wants to know if it can proceed
  // with this packet
  return !storeOrDrop;
};

var TIPS = {
  datapath_id: 'Unique id of the datapath',
  ip_reassembly: 'Datapath can reassemble IP fragments',
  n_buffers: 'Number of packets that can be buffered for controller',
  miss_send_len: 'Prefix of packet in bytes to send to controller',
  mfr_description: 'Manufacturer description',
  hw_description: 'Hardware description',
  sw_description: 'Software description',
  serial_num: 'Serial number',
  dp_description: 'Description of datapath'
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
  mkProfile: mkProfile,
  TIPS: TIPS,
  TESTS: TESTS
};



});
