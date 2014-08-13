var bcrypt = require('bcrypt');

var packModel = require('../model.js');
var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = packModel(testAdapter);
var msg = require('../msg.js');

var session;
//-----------------------------------------------------------------------------
describe('===> Testing packetCreate: \n',function() {
  it('Packet created successfully',function(done) {
  	model.packet.create('Packet1', 1, 
			function(result){
        console.log(result.value);
  		  assert(result.value, "Could not create packet");
		    done();
	    });
  });
});

describe('===> Testing packetList: \n',function() {
  it('All Packets listed successfully',function(done) {
    model.packet.list(1,
      function(result){
        console.log(result.value);
        assert(result.value, "Could not list packet");
        done();
      });
  });
});

describe('===> Testing packetDetail: \n',function() {
  it('Packet fetched successfully',function(done) {
    model.packet.detail(1,2,
      function(result){
        console.log(result.value);
        assert(result.value, "Could not fetch packet");
        done();
      });
  });
});

describe('===> Testing packetUpdate: \n',function() {
  after(function(done) {
    model.packet.list(1,function(result) {console.log(result.value);});
    done();
  })
  it('Packet updated successfully',function(done) {
    model.packet.update(1,{id:1, name: 'UpdatedPacket'},
      function(result){
        assert(result.value, "Could not update packet");
        done();
      });
  });
});

describe('===> Testing packetDestroy: \n',function() {
  after(function(done) {
    model.packet.list(1,function(result) {console.log(result.value);});
    done();
  })
  it('Packet destroyed successfully',function(done) {
    model.packet.destroy(1,1,
      function(result){
        assert(result.value, "Could not destroy packet");
        done();
      });
  });
});

