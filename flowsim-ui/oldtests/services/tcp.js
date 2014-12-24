'use strict';

describe('Service: TCP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var TCP;
  beforeEach(inject(function (_TCP_) {
    TCP = _TCP_;
  }));

  it('Port Construction Pass', function () {
    expect(!!TCP).toBe(true);
    
    TCP.mkPort();
    var port1 = TCP.mkPort('22');
    TCP.mkPort(port1);
  });

  it('Construction Pass', function () {
    expect(!!TCP).toBe(true);

    var PORT1 = 22;
    var PORT2 = 2222;

    var tcp1 = new TCP.TCP(null, PORT1, PORT2);
    var tcp2 = new TCP.TCP(tcp1);
    tcp2.clone();
    TCP.mkTCP(PORT1, PORT2);
  });
  
  it('Construction Fail', function () {
    expect(!!TCP).toBe(true);

    var PORT1 = '100000';
    var PORT2 = '-1';
    var PORT3 = '22';

    expect(function() {new TCP.TCP(null, PORT1, PORT3);}).toThrow();
    expect(function() {TCP.mkTCP(PORT1, PORT3);}).toThrow();
    expect(function() {new TCP.TCP(null, PORT2, PORT3);}).toThrow();
    expect(function() {TCP.mkTCP(PORT2, PORT3);}).toThrow();
  });

  it('Match Tests', function () {
    expect(!!TCP).toBe(true);

    var port1 = TCP.mkPort('22');
    var port2 = TCP.mkPort('2222');

    var match1 = TCP.mkPortMatch('22', '0xffff');
    var match2 = TCP.mkPortMatch('0', '0x0000');

    expect(match1.match(port1)).toBe(true);
    expect(match1.match(port2)).toBe(false);
    expect(match2.match(port1)).toBe(true);
    expect(match2.match(port2)).toBe(true);

  });

  it('Set fields Tests', function () {
    expect(!!TCP).toBe(true);

    var tcp1 = TCP.mkTCP('22','2222');
    expect(tcp1.src().toString()).toBe('22');
    expect(tcp1.dst().toString()).toBe('2222');

    tcp1.src('2222');
    tcp1.dst('22');

    expect(tcp1.src().toString()).toBe('2222');
    expect(tcp1.dst().toString()).toBe('22');
  });

  it('JSON Construction Equivalency Tests', function () {
    expect(!!TCP).toBe(true);
    
    var tcp1 = TCP.mkTCP('22', '2222');
    var TCP = new TCP.TCP(JSON.parse(JSON.stringify(tcp1)));

    expect(TCP.toString()).toBe(tcp1.toString());
  });

  it('Summarize Tests', function () {
    expect(!!TCP).toBe(true);

    var match = TCP.mkPortMatch('65535', '0xffff');
    expect(match.summarize()).toBe('tcp');
  });

  it('Equal Tests', function() {
    expect(!!TCP).toBe(true);

    var match1 = TCP.mkPortMatch('65535', '0xffff');
    var match2 = TCP.mkPortMatch('65535', '0xffff');
    var match4 = TCP.mkPortMatch('0', '0xffff');
    var match5 = TCP.mkPortMatch('65535', '0xff00');

    expect(match1.equal(match2)).toBe(true);
    expect(match2.equal(match1)).toBe(true);

    expect(match4.equal(match1)).toBe(false);
    expect(match5.equal(match1)).toBe(false);
    expect(match1.equal(match4)).toBe(false);
    expect(match1.equal(match5)).toBe(false);

    expect(match4.equal(match5)).toBe(false);
    expect(match5.equal(match4)).toBe(false);
  });

});
