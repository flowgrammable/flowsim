var bcrypt = require('bcrypt');

var packModel = require('../model.js');
var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = packModel(testAdapter);
var msg = require('../msg.js');

var subTestAdapter = require('../../subscriber/test/testAdapter.js');
var subscriberModel = require('../../subscriber/model.js');
var subModel = subscriberModel(subTestAdapter);
var session;
//-----------------------------------------------------------------------------
describe('===> Testing createPacket: \n',function() {
  var encrypted =  bcrypt.hashSync('somePasswd123', 10);
  var testSubscriber = {
      id: 66,
      email: 'testPackCreation@test.com',
      password: encrypted,
      reg_date: new Date(),
      reg_ip: '127.0.0.1',
      verification_token: 'doesntmatter',
      status: 'ACTIVE'
      };
  before(function(){
   subTestAdapter.makeSubscriber(testSubscriber);
   subModel.session.authenticate(testSubscriber.email, 'somePasswd123', function(result){
    subTestAdapter.fetchSession(result.value, function(res) {
      session = res.value;
    });
   });
  });
  it('Packet created successfully',function(done) {
  	model.packet.create('Packet9', session, 
			function(result){
        console.log(result.value);
  		  assert(result.value, "Could not create packet");
		    done();
	    });
  });
});

describe('===> Testing fetchPacket: \n',function() {
  it('Packet fetched successfully',function(done) {
    model.packet.list(session,
      function(result){
        console.log(result.value);
        assert(result.value, "Could not create packet");
        done();
      });
  });
});

