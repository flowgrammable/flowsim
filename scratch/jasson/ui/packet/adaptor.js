
(function(){

var EthernetAdaptor = function(eth) {
  this.actual = eth;
  this.name = 'Ethernet';
  this.fields = [
    { 
      name: 'Src',
      tip: 'Ethernet source MAC address',
      test: macp.test,
      value: '00:00:00:00:00:00'
    }, {
      name: 'Dst',
      tip: 'Ethernet destination MAC address',
      test: macp.test,
      value: '00:00:00:00:00:00'
    }, {
      name: 'type',
      tip: 'Type or size of the payload',
      test: isUInt16,
    }
  ];
}

EthernetAdaptor.prototype.save = function() {
  this.eth.setSrc(this.fields[0].value);
  this.eth.setDst(this.fields[1].value);
  this.eth.setEtherType(this.fields[2].value);
}

var protocol = angular.module('fgProtocol');
protocol.value('EthernetAdaptor', EthernetAdaptor);

})();

