
(function(){

var validator = require('validator');

var util      = require('../server/utils');
var msg       = require('./msg');

function create(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    view.controller.create(req.subscriber_id, req.body, responder);
  };
}

function list(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    view.controller.list(req.subscriber_id, responder);
  };
}

function detail(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    view.controller.detail(req.subscriber_id, req.params.traceName, responder);
  };
}

function update(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    view.controller.update(req.subscriber_id, req.params.traceName,
      req.body, responder);
  };
}

function _remove(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    view.controller._remove(req.subscriber_id, req.params.traceName,
      responder);
  };
}

function View(c, traceLogger) {

  this.controller = c;

  this.logger = traceLogger.child({component: 'view'});

  this.services = [
    {
      method: 'post',
      path: ':traceName',
      handler: util.requiresAuth(create(this))
    } , {
      method: 'get',
      path: '',
      handler: util.requiresAuth(list(this))
    } , {
      method: 'get',
      path: ':traceName',
      handler: util.requiresAuth(detail(this))
    } , {
      method: 'put',
      path: ':traceName',
      handler: util.requiresAuth(update(this))
    } , {
      method: 'del',
      path: ':traceName',
      handler: util.requiresAuth(_remove(this))
    }
  ];
}
exports.View = View;

})();
