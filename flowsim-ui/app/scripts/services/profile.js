'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(ETHERNET, fgConstraints) {

var TIPS = {};
var TESTS = {};

function Datapath(dp) {
  // Copy constructor
  if(dp && dp instanceof Datapath) {
    this.datapath_id   = dp.datapath_id;
    this.ip_reassembly = dp.ip_reassembly;
    this.n_buffers     = dp.n_buffers;
    this.n_tables      = dp.n_tables;

    this.mfc_desc   = dp.mfc_desc;
    this.hw_desc    = dp.hw_desc;
    this.sw_desc    = dp.sw_desc;
    this.serial_num = dp.serial_num;
    this.dp_desc    = dp.dp_desc;
  } 
  // Default constructor
  else {
    this.datapath_id   = '01:23:45:67:89:ab'; // FIXME: bad default
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

Datapath.prototype.clone = function() {
  return new Datapath(this);
};

var DatapathUI = Datapath;
DatapathUI.prototype.toBase = Datapath.prototype.clone;

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
  n_buffers:   fgConstraints.isUInt(0, 0xffff),
  n_tables:    fgConstraints.isUInt(1, 256),
  mfr_desc:    function(v) { return !v || v.length <= 256 ; },
  hw_desc:     function(v) { return !v || v.length <= 256; },
  sw_desc:     function(v) { return !v || v.length <= 256; },
  serial_num:  function(v) { return !v || v.length <= 32; },
  dp_desc:     function(v) { return !v || v.length <= 256; }
};

function Port(p) {
  // Copy constructor
  if(p && p instanceof Port) {
    this.port_id = p.port_id;
    this.mac     = p.mac;
    this.name    = p.name;
    this.speed   = p.speed;
    this.mode    = p.mode;
    this.medium  = p.medium;
  } else {
    if(p && typeof p === 'number') {
      this.port_id = p;
    } else {
      this.port_id = 0
    }
    this.mac    = '00:00:00:00:00:00';
    this.name   = 'eth' + this.port_id;
    this.speed  = '1_gbps';
    this.mode   = 'full_duplex';
    this.medium = 'Copper';
  }
}

Port.prototype.clone = function() {
  return new Port(this);
};

var PortUI              = Port;
PortUI.prototype.toBase = Port.prototype.clone;

TIPS.port = {
  port_id: 'Ethernet port identifier',
  mac:     'MAC address used by port in spanning tree',
  name:    'display name of the port',
  speed:   'physical layer speed of port',
  mode:    'physical layer transmission mode',
  medium:  'physical layer medium of port'
};

TESTS.port = {
  mac: ETHERNET.isMac,
  name: function(v) { return /[a-zA-Z_][a-zA-Z_0-9]*/.test(v) }
};

var SPEEDS = [{
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

var MODES = [{
  label: 'Half Duplex',
  value: 'half_duplex'
}, {
  label: 'Full Duplex',
  value: 'full_duplex'
}];

var MEDIUMS = [
  'Copper',
  'Fiber'
];

function Ports(ports) {
  if(ports && ports instanceof Ports) {
    this.n_ports = ports.n_ports;
    this.ports = _.map(ports.ports, function(port) {
      return new Port(port);
    });
    this.vports = _.clone(ports.vports);
  } else {
    if(ports && typeof ports === 'number'){
      this.n_ports = ports;
    }
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
}

Ports.prototype.clone = function() {
  return new Ports(this);
}

var PortsUI              = Ports;
PortsUI.prototype.toBase = Ports.prototype.clone;

function Meters(meters) {
  if(meters && meters instanceof Meters) {
  } else {
  }
}
Meters.prototype.clone = function() {
  return new Meters(this);
}

var MetersUI = Meters;
MetersUI.prototype.toBase = Meters.prototype.clone;

function Tables(tables) {
  if(tables && tables instanceof Tables) {
  } else {
  }
}

Tables.prototype.clone = function() {
  return new Tables(this);
}

var TablesUI = Tables;
TablesUI.prototype.toBase = Tables.prototype.clone;

function Groups(groups) {
  if(groups && groups instanceof Groups) {
  } else {
  }
}

Groups.prototype.clone = function() {
  return new Groups(this);
}

var GroupsUI              = Groups;
GroupsUI.prototype.toBase = Groups.prototype.clone;

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
      tests: TESTS,
      speeds: SPEEDS,
      mediums: MEDIUMS,
      modes: MODES
    };

});
