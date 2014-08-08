var _ = require('underscore');
var utils = require('./controllerUtils.js');
var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){ events.Emitter.emit(id, result); }

// ----------------------------------------------------------------------------
// Auth

function profCreate(dataModel, session, method, params, data, ip, id) {
  if(method =='POST') {
    if(utils.invalidProfile(data)) return passback(id, msg.missingName());
    if(!data.ofp_version) return passback(id, msg.missingOfpVersion());
    dataModel.profile.create(session.subscriber_id, data.name, data.ofp_version,
    function(result){
      passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

function profUpdate(dataModel, session, method, params, data, ip, id) {
  if(method =='PUT') {
    if(!data.id) return passback(id, msg.missingId());
    if(data.subscriber_id) return passback(id, msg.notAuthorized());
    dataModel.profile.update(session.subscriber_id, data, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}

function profList(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    dataModel.profile.list(session.subscriber_id, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}


function profDetail(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    if(!params[1]) return passback(id, msg.missingId());
    var profId = params[1];
    dataModel.profile.detail(session.subscriber_id, profId, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}

function profDestroy(dataModel, session, method, params, data, ip, id) {
  if(method =='DELETE') {
    if(!params[1]) return passback(id, msg.missingId());
    var profId = params[1];
    dataModel.profile.destroy(session.subscriber_id, profId, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}


// ----------------------------------------------------------------------------


module.exports = function(testAdapter) {
  var dataModel;
	if(testAdapter){
		dataModel = model(testAdapter);
  } else {
		dataModel = model();
	} 
  return {
    module: {
      noauth: {},
      auth: {
        create:  _.bind(profCreate, null, dataModel),
        update:  _.bind(profUpdate, null, dataModel),
        list:    _.bind(profList, null, dataModel),
        detail:  _.bind(profDetail, null, dataModel),
        destroy: _.bind(profDestroy, null, dataModel)
      }
    }
  }
}

