'use strict';

angular.module('flowsimUiApp')
  .factory('Ports', function(UInt, ETHERNET, Regex) {

var VPort = {
  ALL:        0xfffffffc,
  CONTROLLER: 0xfffffffd,
  TABLE:      0xfffffffe,
  IN_PORT:    0xfffffff9,
  LOCAL:      0xfffffff8,
  NORMAL:     0xfffffffa,
  FLOOD:      0xfffffffb
};

var defPortCount   = 24;
var defNamePrefix  = 'eth';
var defPortStats   = true;
var defPortBlocked = true;

var defCurrMaxSpeed = true;

// Port Config defaults
var defPortDown = false;
var defNoRecv   = false;
var defNoFwd    = false;
var defNoPktIn    = false;

// Port State defaults
var defLinkDown = false;
var defLive     = false;

// Basic constants

var _half_duplex = 'Half Duplex';
var _full_duplex = 'Full Duplex';

var defMode = _full_duplex;
var _modes = [_half_duplex, _full_duplex];

var _copper = 'Copper';
var _fiber  = 'Fiber';

var defMedium = _copper;
var _mediums = [_copper, _fiber];

var _10Mbps  = '10 Mbps';
var _100Mbps = '100 Mbs';
var _1Gbps   = '1 Gbps';
var _10Gbps  = '10 Gbps';
var _40Gbps  = '40 Gbps';
var _100Gbps = '100 Gbps';
var _1Tbps = '1 Tbps';

var defSpeed = _10Gbps;
var _speeds = {
  _10Mbps: _10Mbps, 
  _100Mbps: _100Mbps, 
  _1Gbps: _1Gbps, 
  _10Gbps: _10Gbps, 
  _40Gbps: _40Gbps, 
  _100Gbps: _100Gbps,
  _1Tbps: _1Tbps
};

var _pause     = 'Pause';
var _autoNeg   = 'Auto Neg';
var _pauseAsym = 'Pause Asym';

var _procedures = {
  pause: _pause,
  autoNeg: _autoNeg,
  _pauseAsym: _pauseAsym
};
var defProcedures = {};

var defVirtualPorts = {
  in_port:    true,  // mandatory in 1.0+
  table:      true,  // mandatory in 1.0+
  controller: true,  // mandatory in 1.0+
  all:        true,  // mandatory in 1.0+
  local:      true,  // mandatory in 1.0, optional in 1.1+
  normal:     true,  // optional in 1.0-1.4
  flood:      true,  // optional in 1.0-1.4
};

function Port(port, portProfile) {
  if(_.isObject(port)) {
    this.capabilities = new PortProfile(port.capabilities);
    _.extend(this, port);
    this.config = _.clone(port.config);
    this.state  = _.clone(port.state);
  } else {
    // Don't let user changes affect the instantiated switch
    this.capabilities = new PortProfile(portProfile);

    this.id   = portProfile.id;
    this.mac  = portProfile.mac;
    this.name = portProfile.name;
    this.up   = true;

    this.config = {
      port_down: defPortDown,
      no_recv:   defNoRecv,
      no_fwd:    defNoFwd,
      no_pkt_in: defNoPktIn
    };

    this.state  = {
      link_down: defLinkDown,
      blocked:   defPortBlocked,
      live:      defLive
    };

    this.ethernet = {
      medium: this.capabilities.ethernet.medium
    };

    // Set the ethernet property portion of the port
    this.supported = {
      speeds: this.capabilities.ethernet.speeds,
      modes: _modes,
      medium: this.capabilities.ethernet.medium,
      procedures: _procedures,
    };

    this.advertised = {
      speeds: _.clone(this.supported.speeds),
      modes: _.clone(this.supported.modes),
      medium: this.supported.medium,
      procedures: _.clone(this.supported.procedures)
    };

    this.curr = {
      speed: this.capabilities.ethernet.speed,
      mode: defMode,
      medium: this.supported.medium,
      procedures: defProcedures
    };

    this.peer = {
      speeds: [],
      modes: [],
      medium: this.supported.medium,
      procedures: []
    };

    this.curr_speed = this.capabilities.ethernet.speed;
    this.max_speed  = this.capabilities.ethernet.speed;

    this.optical  = {
      // should put some things here
    };
  }
}

Port.prototype.ingress = function(packet) {
  var keep = this.config.no_recv ? false : true;

  // FIXME: stats goes here

  return keep;
};

Port.prototype.egress = function(packet) {
  var drop = this.config.no_fwd ? true : false;
  drop = drop | (this.config.no_pkt_in && this.id === VPort.CONTROLLER);
  
  // FIXME: stats goes here

  return drop;
};

Port.prototype.clone = function() {
  return new Port(this);
};

function Ports(ports, profile) {
  if(_.isObject(ports)) {
    this.capabilities = new Profile(ports.capabilities);
    this.ports = _(ports.ports).map(function(port) {
      return new Port(port);
    });
  } else {
    this.capabilities = new Profile(profile);
    this.ports = _(this.capabilities.ports).map(function(portProfile) {
      return new Port(null, portProfile);
    });
  }
}

Ports.prototype.clone = function() {
  return new Ports(this);
};

Ports.prototype.ingress = function(packet, in_port) {
  return this.ports[in_port].ingress(packet);
};

Ports.prototype.egress = function(packet, out_port) {
  this.ports[out_port].egress(packet);
};

function PortProfile(portProfile, id, mac) {
  if(_.isObject(portProfile)) {
    _.extend(this, portProfile);
    this.ethernet = _.clone(portProfile.ethernet);
    this.optical  = _.clone(portProfile.optical);
  } else {
    this.id = id;
    this.mac = mac;
    this.name = defNamePrefix+id;
    this.state = {
      link_down: false
    };
    this.ethernet = {
      speed: defSpeed,
      speeds: _.clone(_speeds),
      medium: defMedium,
      procedures: defProcedures,
      curr_max_speed: defCurrMaxSpeed
    };
    this.optical = {
    };
  }
}

PortProfile.prototype.ofp_1_0 = function() {
  delete this.ethernet.speeds._40Gbps;
  delete this.ethernet.speeds._100Gbps;
  delete this.ethernet.speeds._1Tbps;
  if(this.ethernet.speed === _40Gbps ||
      this.ethernet.speed === _100Gbps ||
      this.ethernet.sppeed === _1Tbps) {
    this.ethernet.speed = _10Gbps;
  }
  this.ethernet.curr_max_speed = false;
};

// Nothing to clear or reduce
PortProfile.prototype.ofp_1_1 = function() {
  this.ethernet.speeds = _.clone(_speeds);
};
PortProfile.prototype.ofp_1_2 = function() {
  this.ethernet.speeds = _.clone(_speeds);
};
PortProfile.prototype.ofp_1_3 = function() {
  this.ethernet.speeds = _.clone(_speeds);
};
PortProfile.prototype.ofp_1_4 = function() {
  this.ethernet.speeds = _.clone(_speeds);
};

PortProfile.prototype.clone = function() {
  return new PortProfile(this);
};

function Profile(profile, macPrefix) {
  if(_.isObject(profile)) {
    _.extend(this, profile);
    this.ports = _(profile.ports).map(function(port) {
      return new PortProfile(port);
    });
    this.vports = _.clone(profile.vports);
  } else {
    this.n_ports = defPortCount;
    this.macPrefix    = macPrefix;
    this.ports = _(this.n_ports).times(function(id) {
      return new PortProfile(null, id+1, mkMAC(macPrefix, id));
    });
    this.port_stats   = defPortStats;
    this.port_blocked = defPortBlocked;
    this.vports = defVirtualPorts;
  }
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

Profile.prototype.rebuild = function() {
  var base;
  if(this.n_ports === this.ports.length) {
    return;
  } else if(this.n_ports < this.ports.length) {
    this.ports.splice(this.n_ports, this.ports.length-this.n_ports);
  } else {
    base = this.ports.length;
    _(this.n_ports-this.ports.length).times(function(i) {
      var idx = base + i;
      this.ports.push(new PortProfile(null, idx, mkMAC(this.macPrefix, idx)));
    }, this);
  }
};

function mkMAC(prefix, id) {
  // don't use the bridge id ..  maybe this is unnecessary stp hold over
  var idx = UInt.padZeros(id.toString(16), 4);
  return prefix + ':' + idx.slice(0,2) + ':' + idx.slice(2, 4);
}

Profile.prototype.ofp_1_0 = function() {
  this.port_blocked = false;
  _(this.ports).each(function(port) {
    port.ofp_1_0();
  });
};

Profile.prototype.ofp_1_1 = function() {
  this.port_blocked = false;
  _(this.ports).each(function(port) {
    port.ofp_1_1();
  });
};

Profile.prototype.ofp_1_2 = function() {
  _(this.ports).each(function(port) {
    port.ofp_1_2();
  });
};

Profile.prototype.ofp_1_3 = function() {
  _(this.ports).each(function(port) {
    port.ofp_1_0();
  });
};

Profile.prototype.ofp_1_4 = function() {
  _(this.ports).each(function(port) {
    port.ofp_1_0();
  });
};

var TIPS = {
  mac: 'a',
  name: 'b',
  speed: 'c',
  mode: 'd',
  medium: 'e'
};

var TESTS = {
  mac: ETHERNET.MAC.is,
  name: function(v) { return Regex.Identifier.test(v); }
};

var RANGES = {
  speeds: _speeds,
  modes: _modes,
  procedures: _procedures,
  mediums: _mediums
};

return {
  Port: Port,
  Ports: Ports,
  Profile: Profile,
  TIPS: TIPS,
  TESTS: TESTS,
  RANGES: RANGES
};

});
