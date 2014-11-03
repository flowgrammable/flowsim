'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.ports
 * @description
 * # ports
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Ports', function(fgConstraints, ETHERNET) {

var defaultPorts  = 24;
var defaultMAC    = '00:00:00:00:00:01';
var defaultName   = 'eth';
var defaultSpeed  = '1_gbps';
var defaultMedium = 'Fiber';
var defaultMode   = 'full_duplex';
var defaultSpeed  = '10_gbps';

var Port = {};

Port.TIPS = {
  port_id: 'Ethernet port identifier',
  mac:     'MAC address used by port in spanning tree',
  name:    'display name of the port',
  speed:   'physical layer speed of port',
  mode:    'physical layer transmission mode',
  medium:  'physical layer medium of port'
};

Port.TESTS = {
  mac: ETHERNET.isMac,
  name: function(v) { return /[a-zA-Z_][a-zA-Z_0-9]*/.test(v) }
}

Port.Capabilities = function(port) {
  if(typeof port === 'number') {
    // default construction
    this.port_id = port;
    this.mac     = defaultMAC;
    this.name    = defaultName + this.port_id;
    this.speed   = defaultSpeed;
    this.mode    = defaultMode;
    this.medium  = defaultMedium;
  } else {
    // copy construction
    if(!port instanceof Port.Capabilities) {
      _.extend(this, port);
    }
    this.port_id = port.port_id;
    this.mac     = port.mac;
    this.name    = port.name;
    this.speed   = port.speed;
    this.mode    = port.mode;
    this.medium  = port.medium;
  }
}

Port.Capabilities.prototype.openflow_1_0 = function(speeds, mediums, modes) {
  // ensure speed/medium/mode are in param sets
}

Port.Configuration = function(port) {
  if(port) {
    if(port instanceof Port.Capabilities) {
      // Capability constructor
      this.capabilities = port;
    } else if(port instanceof Port.Configuration) {
      // Copy constructor
    } else {
      // JSON constructor
      _.extend(this, port);
    }
  } else {
    // default constructor
  }
}

Port.Speeds = [{
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

Port.Modes = [{
  label: 'Half Duplex',
  value: 'half_duplex'
}, {
  label: 'Full Duplex',
  value: 'full_duplex'
}];

Port.Mediums = [
  'Copper',
  'Fiber'
];

function Capabilities(ports) {
  if(ports) {
    // copy constructor
    if(!ports instanceof Ports) {
      _.extend(this, ports);
    }
    this.n_ports = ports.n_ports;
    this.ports = _.map(ports.ports, function(port) {
      return new Port.Capabilities(port);
    });
    this.speeds = _.clone(ports.speeds);
    this.modes = _.clone(ports.modes);
    this.mediums = _.clone(ports.mediums);
    this.vports = _.clone(ports.vports);
  } else {
    // default constructor
    this.n_ports = defaultPorts;
    this.ports = _.map(_.range(this.n_ports), function(id) {
      return new Port.Capabilities(id);
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
    this.speeds = {
      '10_mbps': true,
      '100_mbps': true,
      '1_gbps': true,
      '10_gbps': true,
      '40_gbps': true,
      '100_bgps': true,
      '1_tbps': true
    };
    this.mediums = {
      'Copper': true,
      'Fiber': true
    };
    this.modes = {
      'half_duplex': true,
      'full_duplex': true
    };
  }
}

Capabilities.prototype.rebuild = function() {
  var i;
  if(this.n_ports === this.ports.length) {
    return;
  } else if(this.n_ports < this.ports.length) {
    this.ports.splice(this.n_ports, this.ports.length-this.n_ports);
  } else {
    for(i=this.ports.length; i<this.n_ports; ++i) {
      this.ports.push(new Port.Capabilities(i));
    }
  }
}

Capabilities.prototype.openflow_1_0 = function() {
  // Ports
  this.vports = {
    port_stats: true,
    stp:        true, // optional
    in_port:    true,
    table:      true,
    normal:     true, // optional
    flood:      true, // optional
    all:        true,
    controller: true,
    local:      true,
    any:        false,
    none:       true
  };

  // set number of ports?
  // construct ports?
};

Capabilities.prototype.openflow_1_1 = function() {
  // Ports
  this.vports = {
    port_stats: true,
    stp:        false,
    in_port:    true,
    table:      true,
    normal:     true, // optional
    flood:      true, // optional
    all:        true,
    controller: true,
    local:      true, // optional
    any:        true,
    none:       false
  };
};

Capabilities.prototype.openflow_1_2 = function() {
  // Ports
  this.vports = {
    port_stats: true,
    stp:        false,
    in_port:    true,
    table:      true,
    normal:     true, // optional
    flood:      true, // optional
    all:        true,
    controller: true,
    local:      true, // optional
    any:        true,
    none:       false
  };
};

Capabilities.prototype.openflow_1_3 = function() {
  // Ports
  this.vports = {
    port_stats: true,
    stp:        false,
    in_port:    true,
    table:      true,
    normal:     true, // optional
    flood:      true, // optional
    all:        true,
    controller: true,
    local:      true, // optional
    any:        true,
    none:       false
  };
};

Capabilities.prototype.openflow_1_4 = function() {
  // Ports
  this.vports = {
    port_stats: true,
    stp:        false,
    in_port:    true,
    table:      true,
    normal:     true, // optional
    flood:      true, // optional
    all:        true,
    controller: true,
    local:      true, // optional
    any:        true,
    none:       false
  };
};

function Configuration(ports) {
  if(ports) {
    if(ports instanceof Capabilities) {
      // capability constructor
    } else if(ports instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, ports);
    }
  } else {
    // default constructor
  }
}

var TIPS = {
  Port: Port.TIPS,
};

var TESTS = {
  Port: Port.TESTS,
};

return {
  Capabilities: Capabilities,
  Configuration: Configuration,
  TIPS: TIPS,
  TESTS: TESTS,
  MEDIUMS: Port.MEDIUMS,
  MODES: Port.MODES,
  SPEEDS: Port.SPEEDS
};

});
