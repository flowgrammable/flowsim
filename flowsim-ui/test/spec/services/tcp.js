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

    new TCP.TCP();
    new TCP.TCP_UI();
    new TCP.TCP_UI(new TCP());
  }

  it('stringify Pass', function () {
    expect(!!TCP).toBe(true);

    var tcp1 = new TCP.TCP();
    tcp1.fields.src = 22;
    tcp1.fields.dst = 2222;
    var tcp2 = JSON.stringify(tcp1);
    var tcp3 = new TCP.TCP(JSON.parse(tcp2));
    
    expect(tcp3.field.src).toBe(22);
    expect(tcp3.field.dst).toBe(2222);
  }
});
