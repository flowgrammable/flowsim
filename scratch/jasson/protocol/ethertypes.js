
var EtherTypes = {
  IPv4: 0x0800,
  ARP: 0x0806,
  RARP: 0x8035,
  VLAN: 0x8100,
  IPv6: 0x86DD,
  MPLSu: 0x8847,
  MPLSm: 0x8848,
  LLDP: 0x88cc
};
exports.EtherTypes = EtherTypes;

Lookup = function(value) {
  for(var prop in EtherTypes) {
    if(EtherTypes[prop] == value)
      return prop;
  }
  return 'UNDEFINED';
}
exports.Lookup = Lookup;

