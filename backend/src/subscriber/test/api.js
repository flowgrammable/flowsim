var mocha = require('mocha');
var assert = require('assert');
var client = require('../../client');

var testUtils = require('../../test/utils');
var msg = require('../msg');

var url = 'https://127.0.0.1:8081/api/';

describe('/api/subscriber', function(){
  // Delete all subscribers, sessions, and packets from db before running tests
  before(function(done){
    testUtils.clearTables(['packet', 'session', 'subscriber'],
      function(err, result){
        if(err){
          console.log(err);
        } else {
          done();
        }
      });
  });

describe('/register', function(){

  var subscriber = {email:'coltonchojnacki@gmail.com', password: 'testpass'};
  it('should return msg.success() on user registration', function(done){
    client.query('subscriber/register', 'POST', {}, subscriber, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert(body.value);
        done();
      }
    });
  });

  it('should return msg.existingEmail() on duplicate registration', function(done){
    client.query('subscriber/register', 'POST', {}, subscriber, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.existingEmail().message);
        done();
      }
    });
  });

});

});
