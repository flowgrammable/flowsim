
var _packet1 = {
  name: 'packet 1',
  protocols: [{
    name: 'Ethernet',
    bytes: 14,
    attrs: [{
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: 'Ethernet source',
      test: function() { return true; }
    }, {
      name: 'Dst',
      value: 'ff:ff:ff:ff:ff:ff',
      tip: 'Ethernet detination',
      test: function() { return true; }
    }, {
      name: 'Src',
      value: '00:00:00:00:00:00',
      tip: '',
      test: function() { return true; }
    }]
  }];
};

var v1 = {
  table: 0,
  buffer: 0x00112301,
  meter: -1,
  packet: _packet1,
  actionSet: [
  ],
  instructionSet: [
  ]
};
