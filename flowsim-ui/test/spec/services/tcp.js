'use strict';

describe('Service: TCP', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var TCP;
  beforeEach(inject(function (_TCP_) {
    TCP = _TCP_;
  }));

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

    var PORT1 = 100000;
    var PORT2 = -1;
    var PORT3 = 22;

    expect(function() {new TCP.TCP(null, PORT1, PORT3);}).toThrow();
    expect(function() {TCP.mkTCP(PORT1, PORT3);}).toThrow();
    expect(function() {new TCP.TCP(null, PORT2, PORT3);}).toThrow();
    expect(function() {TCP.mkTCP(PORT2, PORT3);}).toThrow();
  });

/*  it('Match Tests', function () {
    expect(!!TCP).toBe(true);

    var match = new TCP.UInt.Match(PORT1, PORT2);
    var tcp2 = new TCP.
  });

  it('Equivalency Tests', function () {
  });*/

/*  it('stringify Pass', function () {
    expect(!!TCP).toBe(true);

    var tcp1 = new TCP.TCP();
    var tcp2 = JSON.stringify(tcp1);
    var tcp3 = new TCP.TCP(JSON.parse(tcp2));
    
    expect(tcp3.field.src).toBe(22);
    expect(tcp3.field.dst).toBe(2222);
  });*/
});
