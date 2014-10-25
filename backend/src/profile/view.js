
(function(){

var validator = require('validator');

var util      = require('../server/utils');
var msg       = require('./msg');
var profUtils = require('./utils');

function create(view) {
  return function(req, res, next) {
    var responder = util.Responder(res, next);
    if(req.body.name !== req.params.profileName){
      responder(msg.badValue('Profile url name must equal profile body name'));
    } else {
    profUtils.validateProfile(req.body,
      function(err, result){
      if(err){
        responder(err);
      } else {
        view.controller.create(req.subscriber_id, req.body, responder);
      }
    });
    }
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
    view.controller.detail(req.subscriber_id, req.params.profileName, responder);
  };
}

function update(view){
  return function(req, res, next){
    var responder = util.Responder(res, next);
    profUtils.validateProfile(req.body,
      function(err, result){
      if(err){
        responder(err);
      } else {
        view.controller.update(req.subscriber_id,
          req.params.profileName, req.body, responder);
      }
    });
  };
}

function View(c, profileLogger) {

  this.controller = c;

  this.logger = profileLogger.child({component: 'view'});

  this.services = [
    {
      method: 'post',
      path: '/:profileName',
      handler: util.requiresAuth(create(this))
    } , {
      method: 'get',
      path: '',
      handler: util.requiresAuth(list(this))
    } , {
      method: 'get',
      path: '/:profileName',
      handler: util.requiresAuth(detail(this))
    } , {
      method: 'put',
      path: '/:profileName',
      handler: util.requiresAuth(update(this))
    } , {
      method: 'del',
      path: '/:profileName',
      handler: util.requiresAuth(remove(this))
    }
  ];
}
exports.View = View;

})();
