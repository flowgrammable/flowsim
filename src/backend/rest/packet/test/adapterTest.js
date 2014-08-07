// put adapter test stuff here
var adapter = require('./testAdapter.js');
var assert = require('assert');

// ----------------------------------------------------------------------------
// Testing Packet creation

describe('===> Testing createPacket adapter function:\n', function() {
  it('User registered successfully', function(done) {
    adapter.createPacket('Packet1',1 , function (result) {
      console.log(result.value);
      assert(result.value, "Packet creation unsuccessful")
      done();
    });
  });
});

// Testing fetching of packets

describe('===> Testing fetchPacket adapter function:\n', function() {
  it('Packets fetched successfully', function(done) {
    adapter.fetchPacket(1 , function (result) {
      console.log(result.value);
      assert(result.value, "Packet creation unsuccessful")
      done();
    });
  });
});

