'use strict';

describe('Service: Tables', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Tables;
  var tableProfile;
  var Flow;
  var Protocols;
  beforeEach(inject(function (_Tables_, _Flow_, _Protocols_) {
    Tables = _Tables_;
    Protocols = _Protocols_;
    Flow = _Flow_;
    tableProfile = new Tables.TableProfile(null, 0);
  }));

  it('Priority construction test', function(){
    var pri = new Tables.Priority(null, 1);
    expect(pri.priority).toBe(1);
    expect(pri.flows.length).toBe(0);
  });

  it('Priority add flow test', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1);

    pri.add(flow);
    expect(pri.flows.length).toBe(1);
  });

  it('Priority delete flow test', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1);

    pri.add(flow);
    expect(pri.flows.length).toBe(1);
    pri.del(flow);
    expect(pri.flows.length).toBe(0);
  });

  it('Priority select flow pass', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 1);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow.match.push(ethmatch2);
    flow2.match.push(ethmatch1);
    pri.add(flow);
    pri.add(flow2);

    var ethSrc = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:b:c:d:e:f');
    var ethDst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');
    var key ={
      Ethernet: {
        Src: ethSrc,
        Dst: ethDst
      }
    };
    var testflow = pri.select(key);
    expect(testflow.equal(flow)).toBe(true);
    expect(testflow.equal(flow2)).toBe(false);

  });

  it('Table select flow highest priority pass', function(){
    var table = new Tables.Table(null, tableProfile);
    var pri = new Tables.Priority(null, 1);
    var pri2 = new Tables.Priority(null, 2);
    var pri100 = new Tables.Priority(null, 100);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 2);
    var flow100 = new Flow.Flow(null, 100);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow.match.push(ethmatch2);
    flow100.match.push(ethmatch1);
    flow100.match.push(ethmatch2);
    flow2.match.push(ethmatch1);
    flow2.match.push(ethmatch2);
    pri.add(flow);
    pri2.add(flow2);
    pri100.add(flow100);

    table.add(100, flow100);
    table.add(1, flow);
    table.add(2, flow2);

    var ethSrc = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:b:c:d:e:f');
    var ethDst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');
    var key ={
      Ethernet: {
        Src: ethSrc,
        Dst: ethDst
      }
    };
    var testflow = table.select(key);
    expect(testflow.priority).toBe(100);

  });

  it('Table select exact over wild card', function(){
    var table = new Tables.Table(null, tableProfile);
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 1);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow.match.push(ethmatch2);
    flow.ins.apply.enabled = true;


    table.add(2, flow2);
    table.add(2, flow);
    expect(table.priorities[0].flows.length).toBe(2);
    

    var ethSrc = Protocols.mkFieldUInt('Ethernet', 'Src', 'a:b:c:d:e:f');
    var ethDst = Protocols.mkFieldUInt('Ethernet', 'Dst', 'b:b:b:b:b:b');
    var key ={
      Ethernet: {
        Src: ethSrc,
        Dst: ethDst
      }
    };
    var testflow = table.select(key);
    expect(testflow.ins.apply.enabled).toBe(true);

  });

  it('Table delete flow pass', function(){
    var table = new Tables.Table(null, tableProfile);
    var pri = new Tables.Priority(null, 1);
    var pri2 = new Tables.Priority(null, 2);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 2);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow.match.push(ethmatch2);
    flow2.match.push(ethmatch1);
    flow2.match.push(ethmatch2);
    pri.add(flow);
    pri2.add(flow2);

    table.add(2, flow2);
    table.add(1, flow);

    expect(table.priorities.length).toBe(2);
    table.del(1, flow);
    expect(table.prioritiesPresent[2]).toBe(true);
    expect(table.priorities.length).toBe(1);
    table.del(2, flow2);
    expect(table.priorities.length).toBe(0);
    expect(table.prioritiesPresent[2]).toBe(undefined);
    expect(table.prioritiesPresent[1]).toBe(undefined);

  });

  it('Table add same priority flow pass', function(){
    var table = new Tables.Table(null, tableProfile);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 1);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow2.match.push(ethmatch2);

    table.add(1, flow);
    expect(table.priorities.length).toBe(1);
    expect(table.prioritiesPresent[1]).toBe(true);
    table.add(1, flow2);
    expect(table.priorities.length).toBe(1);

  });

  it('Priority add duplicate flow', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 1);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow.match.push(ethmatch2);
    flow2.match.push(ethmatch2);
    flow2.match.push(ethmatch1);
    pri.add(flow);
    expect(pri.flows.length).toBe(1);
    pri.add(flow2);
    expect(pri.flows.length).toBe(1);

  });

   it('Priority add additional flow', function(){
    var pri = new Tables.Priority(null, 1);
    var flow = new Flow.Flow(null, 1);
    var flow2 = new Flow.Flow(null, 1);
    var ethmatch1 = Protocols.mkMatch('Ethernet', 'Src', 'a:b:c:d:e:f', '');
    var ethmatch2 = Protocols.mkMatch('Ethernet', 'Dst', 'b:b:b:b:b:b', '');
    flow.match.push(ethmatch1);
    flow2.match.push(ethmatch2);
    pri.add(flow);
    expect(pri.flows.length).toBe(1);
    pri.add(flow2);
    expect(pri.flows.length).toBe(2);

  });


  it('Table construction test', function(){
    var table = new Tables.Table(null, tableProfile);
    var j = table.toBase();
    var t2 = new Tables.Table(j);
    expect(t2.priorities.length).toBe(0);
  });

  it('Table insert flow pass', function(){
    var table = new Tables.Table(null, tableProfile);
    var f = new Flow.Flow(null, 1);
  });

});
