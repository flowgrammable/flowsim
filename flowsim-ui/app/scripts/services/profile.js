'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(ETHERNET, fgConstraints) {

var TIPS = {};
var TESTS = {};

function Datapath(dp) {

  if(dp) {
    this.datapath_id   = dp.datapath_id;
    this.ip_reassembly = dp.ip_reassembly;
    this.n_buffers     = dp.n_buffers;
    this.n_tables      = dp.n_tables;

    this.mfc_desc   = dp.mfc_desc;
    this.hw_desc    = dp.hw_desc;
    this.sw_desc    = dp.sw_desc;
    this.serial_num = dp.serial_num;
    this.dp_desc    = dp.dp_desc;
  } else {
  // Capabilities
    this.datapath_id   = '01:23:45:67:89:ab'; // <- need a better answer than t
    this.n_buffers     = 1024;
    this.n_tables      = 256;
    this.ip_reassembly = true;

    // Descriptions
    this.mfr_description = '';
    this.hw_description  = '';
    this.sw_description  = '';
    this.serial_num      = '';
    this.dp_description  = '';
  }
}
var DatapathUI = Datapath;

DatapathUI.prototype.toBase = function() {
  return new Datapath(this);
}

TIPS.datapath = {
  datapath_id: 'Unique id of the datapath',
  ip_reassembly: 'Datapath can reassemble IP fragments',
  n_buffers: 'Number of packets that can be buffered for controller',
  n_tables: 'Number of flow tables available',
  mfr_desc: '',
  hw_desc: '',
  serial_num: '',
  dp_desc: ''
};

TESTS.datapath = {
  datapath_id: function() { return true; },
  n_buffers: fgConstraints.isUInt(0, 0xffff),
  n_tables: fgConstraints.isUInt(1, 256),
  mfr_desc: function(v) { return !v || v.length <= 256 ; },
  hw_desc: function(v) { return !v || v.length <= 256; },
  sw_desc: function(v) { return !v || v.length <= 256; },
  serial_num: function(v) { return !v || v.length <= 32; },
  dp_desc: function(v) { return !v || v.length <= 256; }
};

function Port(p) {
  if(p) {
  }
  if() {
    this.port_id = p
    this.mac     = mac ? mac : '00:00:00:00:00:00';
    this.name    = name ? name : 'eth' + id;
    this.speed   = speed ? speed : '1_gbps';
    this.mode    = mode ? mode : 'full_duplex';
    this.medium  = medium ? medium : 'Copper';
  } else if(p) {

  this.port_id = p.port_id;
  this.mac     = p.mac;
  this.name    = p.name;
  this.speed   = p.speed;
  this.mode    = p.mode;
  this.medium  = p.medium;
}

PortUI.prototype.toBase = function() {
  var result= new Port();
  result.mac = port.mac;
  this.name = port.name;
  this.speed = port.speed;
  this.mode = port.mode;
  this.medium = port.medium;
  return result;
}

PortUI.TIPS = {
  port_id: '',
  mac: '',
  name: '',
  speed: '',
  mode: '',
  medium: ''
};

PortUI.TESTS = {
  mac: ETHERNET.isMac,
  name: function(v) { return /[a-zA-Z_][a-zA-Z_0-9]*/.test(v) }
};

PortUI.SPEEDS = [{
  label: '10 Mbps',
  value: '10_mbps'
}, {
  label: '100 Mbps',
  value: '100_mbps'
}, {
  label: '1 Gbps',
  value: '1_gbps'
}, {
  label: '10 Gbps',
  value: '10_gbps'
}, {
  label: '40 Gbps',
  value: '40_gbps'
}, {
  label: '100 Gbps',
  value: '100_gbps'
}, {
  label: '1 Tbps',
  value: '1_tbps'
}];

PortUI.MODES = [{
  label: 'Half Duplex',
  value: 'half_duplex'
}, {
  label: 'Full Duplex',
  value: 'full_duplex'
}];

PortUI.MEDIUMS = [
  'Copper',
  'Fiber'
];

function Ports() {
  this.n_ports = 24;
  this.ports = _.map(_.range(this.n_ports), function(idx) {
    return new Port(idx);
  });
  this.vports = {
    port_stats: true,
    stp:        false,
    in_port:    true,
    table:      true,
    normal:     true,
    flood:      true,
    all:        true,
    controller: true,
    local:      true,
    any:        true,
    none:       true
  };
}

function PortsUI(ports) {
  ports = ports === undefined ? new Ports() : ports;
  this.n_ports = ports.n_ports;
  this.ports = _.map(ports.ports, function(port) {
    return new Port(port);
  });
  this.vports = _.map(ports.vports, function(value, key) {
    return {
      name: key,
      value: value
    };
  });
}

PortsUI.prototype.toBase = function() {
  var result = new Ports();
  result.n_ports = this.n_ports;
  result.ports = _.map(this.ports, function(port) {
    return port.toBase();
  });
  result.vports = this.vports;
  return result;
};

function Meters() {
}

function MetersUI(m) {
  if(m) {
  } else {
  }
}

MetersUI.prototype.toBase = function() {
  var result = new Meters();
  return result;
};

function Tables() {
}

function TablesUI(t) {
  if(t) {
  } else {
  }
}

TablesUI.prototype.toBase = function() {
  var result = new Tables();
  return result;
};

function Groups() {
}
function GroupsUI(g) {
  if(g) {
  } else {
  }
}

GroupsUI.prototype.toBase = function() {
  var result = new Groups();
  return result;
};

function Profile(name) {
  this.name = name;
  this.datapath = new Datapath();
  this.ports    = new Ports();
  this.meters   = new Meters();
  this.tables   = new Tables();
  this.groups   = new Groups();
}

function ProfileUI(profile) {
  profile = typeof profile === 'string' ? new Profile(profile) : profile;
  this.name = profile.name;
  this.datapath = new DatapathUI(profile.datapath);
  this.ports    = new PortsUI(profile.ports);
  this.meters   = new MetersUI(profile.meters);
  this.tables   = new TablesUI(profile.tables);
  this.groups   = new GroupsUI(profile.groups);
}

ProfileUI.prototype.toBase = function() {
  var result = new Profile(this.name);
  result.datapath = this.datapath.toBase();
  result.ports = this.ports.toBase();
  result.meters = this.meters.toBase();
  result.tables = this.tables.toBase();
  result.groups = this.groups.toBase();
  return result;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.profile
 * @description
 * # profile
 * Service in the flowsimUiApp.
 */

    function create(name) {
      return new Profile(name);
    }

    function createUI(profile) {
      return new ProfileUI(profile);
    }

    function setVersion(profile, version) {
      console.log('version: '+version);
    }

    return {
      create: create,
      createUI: createUI,
      setVersion: setVersion,
      tips: TIPS,
      tests: TESTS
    };

});
