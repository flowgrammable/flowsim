var _ = require('underscore');
var utils = require('./controllerUtils.js');
var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){ events.Emitter.emit(id, result); }

// ----------------------------------------------------------------------------
// Auth

// The profCreate function is responsible for handling requests to 
// api/profile/create. The http method must be POST for this service.
// The request body is validated to ensure it contains a valid name 
// and Openflow version, then the model function for create profile
// is called with the given information.
function profCreate(dataModel, session, method, params, data, ip, id) {
  if(method =='POST') {
    if(utils.invalidProfile(data)) return passback(id, msg.missingName());
    if(!data.ofp_version) return passback(id, msg.missingOfpVersion());
    console.log('session subscriber id', session.subscriber_id);
		dataModel.profile.create(session.subscriber_id, data.name, data.ofp_version,
    function(result){
      passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

// The profUpdate function is responsible for handling requests to 
// api/profile/update. The http method must be PUT for this service.
// The request body is validated to ensure it does not contain a
// subscriber_id since this would allow one to change the profile's
// linked subscriber. Next, the model function for create profile
// is called with the given information.
function profUpdate(dataModel, session, method, params, data, ip, id) {
  if(method =='PUT') {
    if(!data.id) return passback(id, msg.missingId());
    if(data.subscriber_id) return passback(id, msg.notAuthorized());
    dataModel.profile.update(session.subscriber_id, data, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}

// The profList function is responsible for handling requests to 
// api/profile/list. The http method must be GET for this service.
// The model function for list profiles is called with the session's 
// subscriber_id.
function profList(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    dataModel.profile.list(session.subscriber_id, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}

// The profDetail function is responsible for handling requests to 
// api/profile/detail/id. The http method must be GET for this service.
// The request's url is validated to ensure that it contains the id of
// the profile of which to get the details. Next, the model function
// for get profile details is called with the given profile id.
function profDetail(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    if(!params[1]) return passback(id, msg.missingId());
    var profId = params[1];
    dataModel.profile.detail(session.subscriber_id, profId, function(result) { 
      passback(id, result); 
    });
  } else return passback(id, msg.methodNotSupported());
}

// The profDestroy function is responsible for handling requests to 
// api/profile/destroy/id. The http method must be DELETE for this 
// service. The request's url is validated to ensure that it contains
// the id of the profile to destroy. Next, the model function for
// destroy profile is called with the given profile id.
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

