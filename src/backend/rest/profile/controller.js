var _ = require('underscore');
var utils = require('./controllerUtils.js');
var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){ events.Emitter.emit(id, result); }

// ----------------------------------------------------------------------------
// Auth

function profCreate(dataModel, session, method, params, data, ip, id) {
  if(utils.invalidProfile(data)) return passback(id, msg.missingName());
  dataModel.profile.create(session.subscriber_id, data.name, function(result){
    passback(id, result);
  });
}

function profUpdate(dataModel, session, method, params, data, ip, id) {
  if(!data.id) return passback(id, msg.missingId());
  if(data.subscriber_id) return passback(id, msg.notAuthorized());
  dataModel.profile.update(session.subscriber_id, data, function(result) { 
    passback(id, result); 
  });
}

function profList(dataModel, session, method, params, data, ip, id) {
  dataModel.profile.list(session.subscriber_id, function(result) { 
    passback(id, result); 
  });
}

function profDestroy(dataModel, session, method, params, data, ip, id) {
  var profId = params[1];
  dataModel.profile.destroy(session.subscriber_id, profId, function(result) { 
    passback(id, result); 
  });
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
        create: _.bind(profCreate, null, dataModel),
        update: _.bind(profUpdate, null, dataModel),
        list:   _.bind(profList, null, dataModel),
        destroy: _.bind(profDestroy, null, dataModel)
      }
    }
  }
}

