
(function(){

var validator = require('validator');

var util      = require('../server/utils');
var msg       = require('./msg');
var pktUtils   = require('./utils');


function createPacket(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    pktUtils.validPacket(req.body, function(errMsg, result){
      if(err){
        responder(errMsg);
      } else {
        //send packet to createPacket Controller
      }
    });
  };
}

function View(subscriberLogger) {


  this.logger = subscriberLogger.child({component: 'view'});

  this.services = [
    {
      method: 'post',
      path: 'packet',
      handler: util.requiresAuth(createPacket(this))
    }
  ];
}
exports.View = View;

})();
