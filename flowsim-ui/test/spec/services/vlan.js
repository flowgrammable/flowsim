'use strict';

describe('Service: VLAN', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var VLAN;
  beforeEach(inject(function (_VLAN_) {
    VLAN = _VLAN_;
  }));

  it('should do something', function () {
    expect(!!VLAN).toBe(true);
  });

  it('Pcp construction Pass', function() {
    expect(!!VLAN).toBe(true);
    var pcp = VLAN.mkPcp();
    expect(pcp.toString(16)).toBe('0x00');
  });

  it('Dei construction Pass', function() {
    expect(!!VLAN).toBe(true);
    var dei = VLAN.mkDei();
    expect(dei.toString(16)).toBe('0x00');
  });

  it('Vid construction Pass', function() {
    expect(!!VLAN).toBe(true);
    var vid = VLAN.mkVid();
    expect(vid.toString(16)).toBe('0x0000');
  });

  it('Typelen construction Pass', function() {
    expect(!!VLAN).toBe(true);
    var type = VLAN.mkType();
    expect(type.toString(16)).toBe('0x0000');
  });

  it('VLAN construction PASS', function() {
    new VLAN.mkVLAN();
    new VLAN.mkVLAN('0x00','0x01','0x2222', '0xabcd');
  });

  it('VLAN construction fail', function() {
    expect(function(){
      new VLAN.mkVLAN('0xffff', '0xffff', '0xffffff', '0xffffffff');
    }).toThrow();
  });

  it('VLAN pcp match pass', function() {
    var a = VLAN.mkPcp('0x01');
    var b = VLAN.mkPcp('0xff');
    var c = VLAN.mkPcp('0x90');

    var every = VLAN.mkPcpMatch('0x00', '0x00');
    var multi = VLAN.mkPcpMatch('0x01', '0x01');
    var exact = VLAN.mkPcpMatch('0x01', '0xff');

    expect(exact.match(a)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(c)).toBe(false);

    expect(every.match(a)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(c)).toBe(true);

    expect(multi.match(a)).toBe(true);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(c)).toBe(false);


  });

  it('VLAN vid match pass', function() {
    var a = VLAN.mkVid('0x0100');
    var b = VLAN.mkVid('0xffff');
    var c = VLAN.mkVid('0x9011');

    var every = VLAN.mkVidMatch('0x0000', '0x0000');
    var multi = VLAN.mkVidMatch('0x0100', '0x0100');
    var exact = VLAN.mkVidMatch('0x0100', '0xffff');

    expect(every.match(a)).toBe(true);
    expect(every.match(b)).toBe(true);
    expect(every.match(c)).toBe(true);

    expect(multi.match(a)).toBe(true);
    expect(multi.match(b)).toBe(true);
    expect(multi.match(c)).toBe(false);

    expect(exact.match(a)).toBe(true);
    expect(exact.match(b)).toBe(false);
    expect(exact.match(c)).toBe(false);
  });

  it('Vlan Set Field Pass', function() {
    var vlan_disco = VLAN.mkVLAN('0x01','0x02', '0x1111', '0x0800');

    var vlan2 = JSON.stringify(vlan_disco);
    var vlan2_disco = new VLAN.VLAN(JSON.parse(vlan2));

    vlan_disco.pcp('0x01');
    expect(vlan_disco.pcp().toString(16)).toBe('0x01');

    vlan_disco.dei('0x02');
    expect(vlan_disco.dei().toString(16)).toBe('0x02');

    vlan_disco.vid('0x7777');
    expect(vlan_disco.vid().toString(16)).toBe('0x7777');

    vlan_disco.type('0x0800');
    expect(vlan_disco.type().toString(16)).toBe('0x0800');

    vlan2_disco.pcp('0x01');
    expect(vlan2_disco.pcp().toString(16)).toBe('0x01');

    vlan2_disco.dei('0x02');
    expect(vlan2_disco.dei().toString(16)).toBe('0x02');

    vlan2_disco.vid('0x7777');
    expect(vlan2_disco.vid().toString(16)).toBe('0x7777');

    vlan2_disco.type('0x0800');
    expect(vlan2_disco.type().toString(16)).toBe('0x0800');


  });
});
