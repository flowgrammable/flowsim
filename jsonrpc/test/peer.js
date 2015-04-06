var expect = require('expect.js');
var _ = require('underscore');
var net = require('net');
var jrpc = require('../jsonrpc.js');
var logg = require('../logger');

var log = new logg.Logger({output: false});

describe('Peer', function(){
  describe('rxRequest', function(){
    var testRequest= {id:0, method:'test', params:[]};
    it('should exec reqCB', function(done){
      var server = new net.createServer(function(sock){
        peer = new jrpc.Peer(sock, 
            function(){
              done();
            }, 
            function(){
            },
            50000,
            function(){
            }, log);
      }).listen(4445);
     var client = new net.createConnection(4445);
       client.write(JSON.stringify(testRequest), function(){
       });
     });
  });

  describe('txRequest', function(){
    var remoteServ = new net.Server(function(c){
      c.on('data', function(msg){
        var jmsg = JSON.parse(msg);
        if(jmsg.method === 'respond'){
         c.write(JSON.stringify({id: jmsg.id, result:[], error: null}));
        }
      });
    }).listen(4440);
    var cli = new net.createConnection(4440);
    var peer = new jrpc.Peer(cli, function(){}, function(){}, 1000,
      function(){}, log);

    it('request id, time, and callback should be stored', function(done){
      peer.request('nores', [], function(msg){ });
      expect(_.values(peer.requests).length).to.be(1);
      peer.requests = {};
      done();
    });

    it('response callback executed', function(done){
      peer.request('respond', [], function(msg){ done(); });
    });

    it('response should remove request entry from storage', function(done){
      peer.request('respond', [], function(msg){ });
      setTimeout(function(){
        expect(_.values(peer.requests).length).to.be(0);
        done();
      },250);
    });

    it('should timeout after specified timeout', function(done){
      peer.request('nores', [], function(error, msg){
        if(error){
         done();
        } 
      });
      setTimeout(function(){
        peer.timer();
      },peer.time_wait);
    });

    it('timed out requests should be removed from storage', function(done){
      expect(_.values(peer.requests).length).to.be(0);
      done();
    });
  });

});

/*
 * Peer 
 *  .sock 
 *    should call destroy cb on 'end'
 *    should call recv on 'data'
 *  .dtor
 *    should execute destroy callback
 *    should set all active requests to timedout
 *  .rxResponse
 *    should execute callback
 *    should destroy entry
 *    should log
 *  .timer 
 *    should be settable
 *    should destroy entry on timeout
 *    should log with reason
 *  .recv
 *    should determine good msg types
 *    should log bad msg type
 *  .rxRequest
 *    should execute rxReq callback
 *  .rxResponse
 *    should execute assigned callback
 *    should log failure if ID does not exist
 *  .request
 *    should add entry to table
 *    should send msg
 *  .response
 *    should send msg
 *  .notify
 *    should send msg
 */
