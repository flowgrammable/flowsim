
(function(){

var validator = require('validator');

var util      = require('../server/utils');
var msg       = require('./msg');
var pktUtils   = require('./utils');


function create(view) {
  return function(req, res, next) {
    console.log('hit create view');
    var responder = util.Responder(res, next);
    var packet = {};
    console.log(req.body);
    pktUtils.validatePacket(req.body, function(err, result){
      if(err){
        responder(err);
      } else {
        //lightly sanitize send packet to createPacket Controller
        packet.name = req.body.name;
        packet.bytes = req.body.bytes;
        packet.protocols = req.body.protocols;
        view.controller.create(req.subscriber_id, packet, responder);
      }
    });
  };
}

function list(view){
  return function(req, res, next){
    console.log('hit list view');
    view.controller.list(req.subscriber_id, responder);
  }
}

function View(c, packetLogger) {

  this.controller = c;

  this.logger = packetLogger.child({component: 'view'});

  this.services = [
    {
      method: 'post',
      path: '',
      handler: util.requiresAuth(create(this))
    } , {
      method: 'get',
      path: '',
      handler: util.requiresAuth(list(this))
    }
  ];
}
exports.View = View;

})();
