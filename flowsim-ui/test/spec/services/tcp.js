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

  it('Equivalency Tests', function () {
    expect(!!TCP).toBe(true);
    
    var tcp1 = JSON.stringify(TCP.mkTCP('22', '2222'));
    var tcp2 = new TCP.TCP(JSON.parse(tcp1));

    expect(tcp2.src).toBe('22');
    expect(tcp2.dst).toBe('2222');
  });

/*  it('stringify Pass', function () {
    expect(!!TCP).toBe(true);

    var tcp1 = new TCP.TCP();
    var tcp2 = JSON.stringify(tcp1);
    var tcp3 = new TCP.TCP(JSON.parse(tcp2));
    
    expect(tcp3.field.src).toBe(22);
    expect(tcp3.field.dst).toBe(2222);
  });*/
});
