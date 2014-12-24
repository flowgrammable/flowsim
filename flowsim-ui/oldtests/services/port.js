'use strict';

describe('Service: port', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Port;
  beforeEach(inject(function (_Port_) {
    Port = _Port_;
  }));

  it('should do something', function () {
    expect(!!Port).toBe(true);
  });

  it('port constructor pass', function() {
    new Port.mkPort();
    new Port.mkPort('0x000000001', '0x000000001');
  });

  it('Inport match pass', function(){
    var inport  = Port.mkPort('0x00000001','0x00000001');
    var inportMatch = Port.mkInportMatch(inport.id());

    var p  = Port.mkPort('0x00000001', '0xabcdeff1');
    var p2 = Port.mkPort('0x00000008', '0xddeeffaa');

    expect(inportMatch.match(p)).toBe(true);
    expect(inportMatch.match(p2)).toBe(false);
  });

});
