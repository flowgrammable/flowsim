
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
    view.controller.detail(req.subscriber_id, req.params.switchName, responder);
  };
}

function update(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    view.controller.update(req.subscriber_id, req.params.switchName,
      req.body, responder);
  };
}

function _remove(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    view.controller._remove(req.subscriber_id, req.params.switchName,
      responder);
  };
}

function View(c, switchLogger) {

  this.controller = c;

  this.logger = switchLogger.child({component: 'view'});

  this.services = [
    {
      method: 'post',
      path: ':switchName',
      handler: util.requiresAuth(create(this))
    } , {
      method: 'get',
      path: '',
      handler: util.requiresAuth(list(this))
    } , {
      method: 'get',
      path: ':switchName',
      handler: util.requiresAuth(detail(this))
    } , {
      method: 'put',
      path: ':switchName',
      handler: util.requiresAuth(update(this))
    } , {
      method: 'del',
      path: ':switchName',
      handler: util.requiresAuth(_remove(this))
    }
  ];
}
exports.View = View;

})();
