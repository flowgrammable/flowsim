var uuid = require('node-uuid');
var mocha = require('mocha');
var assert = require('assert');

var pg = require('../../database/pg');
var st = require('./../storage');
var msg = require('../msg');
var logger = require('../../logger/loggerStub');
var log = new logger.Logger();
var utils = require('../../test/utils');

var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}}, log);

var store = new st.Storage(db, log);

function genString(n){
  var y = '';
  for(i=0;i<n;i++) y+= 'a';
  return y;
}

// Create test subscriber
var d = new Date();
var dISO = d.toISOString();
var ts = { email: 'testSub@mail.com', password: '123',
    date: dISO, ip: '1.1.1.1', token: uuid.v4() };


describe('Storage', function(){
describe('.createSubscriber(email, password, date, ip, token, cb)', function(){

  // Delete all subscribers from db before running tests
  before(function(done){
    utils.clearTables(['packet', 'session', 'subscriber'], function(err, res){
      if(err){
        console.log(err);
      } else {
        done();
      }
    });
  });

  it('should return {id, email, etc} on successful insert', function(done){
    store.createSubscriber(ts.email, ts.password, ts.date, ts.ip, ts.token,
      function(err, result){
        if(err){
          console.log('createSub error', err);
        } else {
          assert.equal(result.email, ts.email);
          done();
        }
    });
   });

  it('should set subscriber status to CREATED', function(done){
    store.getSubscriberByToken(ts.token, function(err, result){
      assert.equal(result.status, 'CREATED');
      done();
    });
  });

  it('should return msg.existingEmail() on duplicate registration',
    function(done){
      store.createSubscriber(ts.email, ts.password, ts.date, ts.ip, ts.token,
        function(err, result){
            assert.equal(err.detail.type, 'existingEmail');
            done();
      });
    });

});

describe('.verifySubscriber(token, cb)', function(){

  it('should return updated row on successful verification', function(done){
    store.verifySubscriber(ts.token, function(err, result){
      assert.equal(result.status, 'ACTIVE');
      done();
    });
  });

  it('should return unknownVerificationToken() on 2nd verification try',
    function(done){
      store.verifySubscriber(ts.token, function(err, result){
        assert.equal(err.detail.type, 'unknownVerificationToken');
        done();
      });
  });


  it('should return unknownVerificationToken() for a bad token',
    function(done){
      store.verifySubscriber('', function(err, result){
        assert.equal(err.detail.type, 'unknownVerificationToken');
        done();
      });
  });
});

describe('.getSubscriberByEmail(email, cb)', function(){

  it('should return an array with a single subscriber', function(done){
    store.getSubscriberByEmail(ts.email, function(err, result){
      assert.equal(result.email, ts.email);
      done();
    });
  });

  it('should return a msg.unknownEmail for invalid email', function(done){
    store.getSubscriberByEmail('nope', function(err, result){
      assert.equal(err.detail.type, 'unknownEmail');
      done();
    });
  });

});

var sessID;
describe('.createSession(token, subscriberId, expireTime, cb)', function(){
  var subID;
  var token = uuid.v4();
  var expireTime = new Date((new Date()).getTime() + 1 * 60000);

  before(function(done){
    store.getSubscriberByEmail(ts.email, function(err, result){
      subID = result.id;
      done();
    });
  });

  it('should return a x-auth token', function(done){
    store.createSession(token, subID, expireTime.toISOString(),
      function(err, result){
        sessID = result.id;
        assert.equal(result.key, token);
        done();
    });
  });

});

describe('.deleteSession(sessionID, callback)', function(){
  it('should return success msg on deletion', function(done){
    store.deleteSession(sessID, function(err, result){
      assert.equal(result, '');
      done();
    });
  });

  it('on duplicated deletion', function(done){
    store.deleteSession(sessID, function(err, result){
      assert.equal(err.detail.type, 'unknownSessionToken');
      done();
    });
  });
});



describe('.getSubscriberByToken(token, cb)', function(){

  it('should return an array of subscribers', function(done){
    store.getSubscriberByToken(ts.token, function(err, result){
      assert.equal(result.email, ts.email);
      done();
    });
  });

  it('should return an empty array if sub does not exist', function(done){
    store.getSubscriberByToken('madeup', function(err, result){
      assert.equal(err.detail.type, 'unknownVerificationToken' );
      done();
    });
  });

});

describe('.resetSubscriber(email, token, cb)', function(){

  it('should return updated subscriber row on successful reset', function(done){
    store.resetSubscriber(ts.email, 'resetToken', function(err, result){
      assert.equal(result.status, 'RESET');
      done();
    });
  });

});

describe('.updateSubscriberPasswordByToken(token, hash, cb)', function(){

  it('should return updated subscriber row on success', function(done){
    store.updateSubscriberPasswordByToken('resetToken', 'newpassword', function(err, result){
      assert.equal(result.password, 'newpassword');
      done();
    });
  });

  it('should return msg.unknownVerificationToken() for invalid token',
    function(done){
      store.updateSubscriberPasswordByToken('', 'newpass', function(err, result){
        assert.equal(err.detail.type, 'unknownVerificationToken');
        done();
      });
   });
});
});
db.close();
