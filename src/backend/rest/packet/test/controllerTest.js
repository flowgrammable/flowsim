var assert = require('assert');

var msg = require('../msg.js');
var testAdapter = require('./testAdapter.js');
var controller = require('../controller.js')(testAdapter);
var events = require('../../../events.js');

//-----------------------------------------------------------------------------
// Create Packet Controller Tests
describe('===> Testing create packet controller: \n', function(){
  it('Test if name not provided', function(done){
    var testId = 'testerID1';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = { name: '', bytes: 256 };
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingPacketName()));
      done();
    });
  controller.module.auth.create(session, 'POST', {}, data, '127.0.0.1', testId);
  });
  it('Test if method is not POST', function(done){
    var testId = 'testerID2';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {name:'something', bytes: 256};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(msg.methodNotSupported()));
      done();
    });
  controller.module.auth.create(session,'GET', {}, data, '127.0.0.1', testId);
  });
});

describe('===> Testing list packet controller: \n', function(){
  it('Test if method is not GET', function(done){
    var testId = 'testerID3';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(msg.methodNotSupported()));
      done();
    });
  controller.module.auth.list(session,'POST', {}, data, '127.0.0.1', testId);
  });
});

describe('===> Testing detail packet controller: \n', function(){
  it('Test if packet_id not provided', function(done){
    var testId = 'testerID4';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingId()));
      done();
    });
  controller.module.auth.detail(session, 'GET', {}, data, '127.0.0.1', testId);
  });
  it('Test if method is not GET', function(done){
    var testId = 'testerID5';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(msg.methodNotSupported()));
      done();
    });
  controller.module.auth.detail(session,'POST', {}, data, '127.0.0.1', testId);
  });
});

describe('===> Testing update packet controller: \n', function(){
  it('Test if id not provided', function(done){
    var testId = 'testerID6';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = { id: '', name: 'something' };
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingId()));
      done();
    });
  controller.module.auth.update(session, 'PUT', {}, data, '127.0.0.1', testId);
  });
  it('Test if name not provided', function(done){
    var testId = 'testerID7';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = { id: 1, name: '' };
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingPacketName()));
      done();
    });
  controller.module.auth.update(session, 'PUT', {}, data, '127.0.0.1', testId);
  });
  it('Test if subscriber_id provided', function(done){
    var testId = 'testerID8';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = { id: 1, name: 'something', subscriber_id: 123 };
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.notAuthorized()));
      done();
    });
  controller.module.auth.update(session, 'PUT', {}, data, '127.0.0.1', testId);
  });
  it('Test if method is not PUT', function(done){
    var testId = 'testerID9';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {name:'something'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(msg.methodNotSupported()));
      done();
    });
  controller.module.auth.update(session,'GET', {}, data, '127.0.0.1', testId);
  });
});

describe('===> Testing destroy packet controller: \n', function(){
  it('Test if packet_id not provided', function(done){
    var testId = 'testerID10';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingId()));
      done();
    });
  controller.module.auth.destroy(session, 'DEL', {}, data, '127.0.0.1', testId);
  });
  it('Test if method is not DEL', function(done){
    var testId = 'testerID11';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = {};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result),JSON.stringify(msg.methodNotSupported()));
      done();
    });
  controller.module.auth.destroy(session,'POST', {}, data, '127.0.0.1', testId);
  });
});

