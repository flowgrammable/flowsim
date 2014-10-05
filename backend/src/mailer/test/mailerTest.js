var mocha = require('mocha');
var assert = require('assert');

var mailer = require('../index.js');

var loggerStub = require('../../logger/loggerStub.js');
var logger = new loggerStub.Logger();

describe('Mailer', function(){
describe('mailer.Mailer(conf)', function(){
  
  it('should throw error on missing config', function(done){
    var conf = {};
    try{
    var m = new mailer.Mailer(conf);
    } catch(err){
      assert.equal(err.message, 'Mailer: missing config');
      done();
    }
  });

  it('should throw error on missing apiKey config', function(done){
    var conf = {mailer: { apiKey: '', domain: 'flowgrammable.org', user: 'c@c'}};
    try{
    var m = new mailer.Mailer(conf);
    } catch(err){
      assert.equal(err.message, 'Mailer: missing config.apiKey');
      done();
    }
  });

  it('should throw error on missing domain config', function(done){
    var conf = {mailer: { apiKey: '123', domain: '', user: 'c@c' }};
    try{
    var m = new mailer.Mailer(conf);
    } catch(err){
      assert.equal(err.message, 'Mailer: missing config.domain');
      done();
    }
  });

  it('should throw error on missing user config', function(done){
    var conf = {mailer: { apiKey: '123', domain: 'flowgrammable.org', 
                user: '' }};
    try{
    var m = new mailer.Mailer(conf);
    } catch(err){
      assert.equal(err.message, 'Mailer: missing config.user');
      done();
    }
  });
});

describe('mailer.send(dst, sub, body, callback)', function(){
  it('should return MailerError for invalid credentials', function(done){
    var config = {mailer: { apiKey: '123', domain: 'flowgrammable.org',
                user: 'c@c'}};
    var n = new mailer.Mailer(config, logger);
    
    this.timeout(10000);    
    n.send('test@flowgrammable.org', 'testMail', {}, function(err, result){
      assert.equal(err.description, 'InvalidMailgunCredentials');  
      done();
    });
  }); 
});

});
