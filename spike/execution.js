
var _packet0 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [0,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,0,0,0,0,0],
        bytes: 6
      }
    },
    _type: {
      value: 33024,
      bytes: 2
    }
  }, {
    name: 'VLAN',
    bytes: 4,
    _pcp: {
      value: 0,
      bytes: 1
    },
    _dei: {
      value: 0,
      bytes: 1
    },
    _vid: {
      value: 10000,
      bytes: 2
    },
    _typelen: {
      value: 33024,
      bytes: 2
    }
  }, {
    name: 'VLAN',
    bytes: 4,
    _pcp: {
      value: 0,
      bytes: 1
    },
    _dei: {
      value: 0,
      bytes: 1
    },
    _vid: {
      value: 100,
      bytes: 2
    },
    _typelen: {
      value: 2048,
      bytes: 2
    }
  }, {
    name: 'IPv4',
    bytes: 20,
    _dscp: {
      value: 0,
      bytes: 1
    },
    _ecn: {
      value: 0,
      bytes: 1
    },
    _proto: {
      value: 6,
      bytes: 1
    },
    _src: {
      _ip: {
        value: 167772161,
        bytes: 4
      }
    },
    _dst: {
      _ip: {
        value: 184615169,
        bytes: 4
      }
    }
  }, {
    name: 'TCP',
    bytes: 20,
    _src: {
      value: 1000,
      bytes: 2
    },
    _dst: {
      value: 5060,
      bytes: 2
    }
  }]
};

var v0 = {
  table: 0,
  buffer: 0x00112301,
  meter: -1,
  packet: _packet1,
  actionSet: [{
    name: 'eth',
    value1: 'src=',
    value2: '00:00:00:00:00:00'
  },{
    name: 'eth',
    value1: 'dst=',
    value2: '00:00:00:00:00:00'
  },{
    name: 'queue',
    value1: 5
  }],
  ins: [{
    name: 'Meter',
    value1: 1234
  }, {
    name: 'Apply'
    set: [{
      name: 'eth',
      value1: 'src=',
      value2: '01:00:00:00:00:00'
    }, {
      name: 'icmpv6',
      value1: 'type=',
      value2: '2'
    }, {
      name: 'Output',
      value1: 1
    }]
  }, {
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  }]
};
