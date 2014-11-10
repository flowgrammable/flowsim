
var _packet0 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x03e8',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000,
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
    name: 'Apply',
    set: [{
      name: 'eth',
      value1: 'src=',
      value2: '01:00:00:00:00:00'
    }, {
      name: 'vlan',
      value1: 'vid=',
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet1 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x03e8',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000,
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
    name: 'Apply',
    set: [{
      name: 'eth',
      value1: 'src=',
      value2: '01:00:00:00:00:00'
    }, {
      name: 'vlan',
      value1: 'vid=',
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet2 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x03e8',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000,
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
    name: 'Apply',
    set: [{
      name: 'vlan',
      value1: 'vid=',
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet3 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000,
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
    name: 'Apply',
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet4 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet5 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet6 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet7 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000
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
    name: 'Goto',
    value1: 5
  }]
};

var _packet8 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000
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
  },
  packet: _packet8,
  actionSet: [{
    name: 'Group',
    value1: 2
  }],
  ins: [{
    name: 'Goto',
    value1: 5
  }]
};

var _packet9 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source address'
    },{
      name: 'Dst',
      value: '00:11:22:33:44:55',
      tip: 'Ethernet destination address'
    },{
      name: 'Type',
      value: '0x8100',
      tip: 'Typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0002',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'VLAN',
    bytes: 4,
    attrs: [{
      name: 'PCP',
      value: '0x00',
      tip: 'pcp'
    },{
      name: 'DEI',
      value: '0x00',
      tip: 'dei'
    },{
      name:'VID',
      value: '0x0000',
      tip: 'vid'
    },{
      name: 'Typelen',
      value: '0x8100',
      tip: 'typelen'
    }]
  }, {
    name: 'IPv4',
    bytes: 20,
    attrs: [{
      name: 'DSCP',
      value: '0x00',
      tip: 'dscp'
    },{
      name: 'ECN',
      value: '0x00',
      tip: 'ecn'
    },{
      name: 'Proto',
      value: '0x06',
      tip: 'protocol'
    },{
      name: 'Src',
      value: '10.0.0.1',
      tip: 'source address'
    },{
      name: 'Dst',
      value: '11.1.1.1',
      tip: 'destination address'
    }]
  }, {
    name: 'TCP',
    bytes: 20,
    attrs: [{
      name: 'Src',
      value: '0xabcd',
      tip: 'src port'
    }, {
      name: 'Dst',
      value: '0xabcd',
      tip: 'dst port'
    }]
  }, {
    name: 'Payload',
    bytes: 1000
  }]
};

var v9 = {
  table: 5,
  buffer: 0x000000,
  queue: 0,
  meter: 1234,
  metadata: {
    value1: '00:11:22:44:55:66:77',
    value2: '00:ff:ff:00:00:ff:ff'
  },
  packet: _packet9,
  actionSet: [{
    name: 'Group',
    value1: 2
  }],
  ins: []
};
