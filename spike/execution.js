
var _packet0 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [0,17,34,51,68,85],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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
  buffer: 0x000000,
  queue: 0,
  meter: 0,
  packet: _packet0,
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
  },{
    name: 'Output',
    value1: 2
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
  },{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};



var _packet1 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [0,17,34,51,68,85],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v1 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
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
  },{
    name: 'Output',
    value1: 2
  }],
  ins: [{
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
  },{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet2 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v2 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  packet: _packet2,
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
  },{
    name: 'Output',
    value1: 2
  }],
  ins: [{
    name: 'Apply'
    set: [{
      name: 'icmpv6',
      value1: 'type=',
      value2: '2'
    }, {
      name: 'Output',
      value1: 1
    }]
  },{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet3 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v3 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  packet: _packet3,
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
  },{
    name: 'Output',
    value1: 2
  }],
  ins: [{
    name: 'Apply'
    set: [{
      name: 'Output',
      value1: 1
    }]
  },{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet4 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v4 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  packet: _packet4,
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
  },{
    name: 'Output',
    value1: 2
  }],
  ins: [{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet5 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v5 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  packet: _packet5,
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
  },{
    name: 'Output',
    value1: 2
  }],
  ins: [{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet6 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v6 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  packet: _packet6,
  actionSet: [],
  ins: [{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet7 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v7 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  packet: _packet6,
  actionSet: [{
    name: 'Group',
    value1: 2
  }],
  ins: [{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto'
  }]
};

var _packet8 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    _src: {
      _mac: {
        value: [1,0,0,0,0,0],
        bytes: 6
      }
    },
    _dst: {
      _mac: {
        value: [0,17,34,51,68,85],
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

var v8 = {
  table: 0,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  metadata: {
    value1: '00:11:22:44:55:66:77',
    value2: '00:ff:ff:00:00:ff:ff'
  }
  packet: _packet8,
  actionSet: [{
    name: 'Group',
    value1: 2
  }],
  ins: [{
    name: 'Goto'
  }]
};
