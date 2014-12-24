'use strict';

describe('Service: ports', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Ports;
  beforeEach(inject(function (_Ports_) {
    Ports = _Ports_;
  }));
  var Datapath;
  beforeEach(inject(function (_Datapath_) {
    Datapath = _Datapath_;
  }));

  it('Ports profile construction Pass', function () {
     var dpProfile = new Datapath.Profile();
     var portsProfile = new Ports.Profile(null, dpProfile.getMACPrefix());

     expect(portsProfile.n_ports).toBe(24);
     var pp = Ports.mkPortsProfile();
     expect(pp.n_ports).toBe(24);
  });

  it('Ports profile construction Fail', function() {
    expect(function(){
      new Ports.Profile();
    }).toThrow();
  });

  it('Ports profile copy construction Pass', function () {
    var dpProfile = new Datapath.Profile();
    var portsProfile = new Ports.Profile(null, dpProfile.getMACPrefix());

    expect(portsProfile.n_ports).toBe(24);
    var ports2 = new Ports.Profile(portsProfile);
    expect(ports2.macPrefix).toBe(portsProfile.macPrefix);

    var j = JSON.stringify(portsProfile);
    var j_ = new Ports.Profile(JSON.parse(j));

    expect(j_.macPrefix).toBe(ports2.macPrefix);
  });

  it('Ports rebuild ', function(){
    var portsProfile = Ports.mkPortsProfile();
    expect(portsProfile.ports.length).toBe(24);

    portsProfile.n_ports = 1;
    portsProfile.rebuild();
    expect(portsProfile.ports.length).toBe(1);
    expect(portsProfile.ports[0].id).toBe(1);
    expect(portsProfile.ports[0].name).toBe('eth1');

    portsProfile.n_ports = 5;
    portsProfile.rebuild();
    expect(portsProfile.ports.length).toBe(5);
    expect(portsProfile.ports[1].id).toBe(2);
    expect(portsProfile.ports[1].name).toBe('eth2');
  });

  it('Port profile construction Pass', function() {
    var portProfile = new Ports.PortProfile(null, 0,
          Ports.mkMAC('aa:bb:cc:dd', 0));
  });

  it('Port profile construction Fail', function() {
    expect(function(){
      new Ports.PortProfile();
    }).toThrow();
  });

  it('Port profile copy construction', function() {
    var portProfile = new Ports.PortProfile(null, 0,
      Ports.mkMAC('aa:bb:cc:dd', 0));

    var port2 = new Ports.PortProfile(portProfile);
    expect(port2.id).toBe(0);
    expect(port2.state['link_down']).toBe(false);

    var j = JSON.stringify(port2);
    var j_ = new Ports.PortProfile(JSON.parse(j));

    expect(j_.id).toBe(0);

  });



});
