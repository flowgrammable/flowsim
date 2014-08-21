// put adapter test stuff here
var adapter = require('./testAdapter.js');
var assert = require('assert');
var packet;
// ----------------------------------------------------------------------------
// Testing Packet creation

describe('===> Testing createPacket adapter function:\n', function() {
  it('User registered successfully', function(done) {
    adapter.createPacket(1, 'Packet1', 256, function (result) {
      console.log(result.value);
      assert(result.value, "Packet creation unsuccessful")
      done();
    });
  });
});

// Testing fetching of packets

describe('===> Testing fetchPacket adapter function:\n', function() {
  it('Packets fetched successfully', function(done) {
    adapter.fetchPacket({ subscriber_id: 1, name: 'Packet1' } ,function (result) {
      console.log(result.value);
      assert(result.value, "Packet creation unsuccessful");
      packet = result.value;
      done();
    });
  });
  it('Packet not found', function(done) {
    adapter.fetchPacket({ name: "nonexistent packet" }, function(result) {
      assert.equal(result.error.type, "packetNotFound")
      done();
    });
  });
});

// Testing Listing of packets

describe('===> Testing listPackets adapter function:\n', function() {
  it('Packets listed successfully', function(done) {
    adapter.listPackets(1 , function (result) {
      console.log(result.value);
      assert(result.value, "Problem listing packets")
      done();
    });
  });
});

// Testing updatePacket
describe('===> Testing updatePacket adapter function:\n', function() {
  it('Packet updated successfully', function(done) {
    adapter.updatePacket(packet, { name: "updated packet" },
    function(result) {
      assert(result.value, "Unable to update packet")
      done();
    });
  });
});

// Testing destroyPacket
describe('===> Testing destroyPacket adapter function:\n', function() {
  it('Packet destroyed successfully', function(done) {
    adapter.destroyPacket(packet, function(result) {
      assert(result.value, "Unable to destroy packet")
      done();
    });
  });
});

