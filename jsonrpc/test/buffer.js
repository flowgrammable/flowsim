var expect = require('expect.js');
var buff   = require('../buffer.js');

describe('Buffer Read', function(){

  it('valid stream', function(){
    var tj = '{"test": [{"item":1}]}';
    var buf = new buff.Buffer();
    buf.read(tj);
  });
  
  it('valid stream chunks', function(){
    var tj1 = '{"test":';
    var tj2 = '[{"item":1}';
    var tj3 = ']}{"hi":';
    var tj4 = '"world"}';
    var buf = new buff.Buffer();
    expect(buf.read(tj1).length).to.be(0);
    expect(buf.read(tj2).length).to.be(0);
    expect(buf.read(tj3).length).to.be(1);
    expect(buf.read(tj4).length).to.be(1);
  });

  it('invalid stream', function(){
    var tj = '{"test": ["item":1}]}';
    var buf = new buff.Buffer();
    expect(function(){
      buf.read(tj);
    }).to.throwError();
  });

});
