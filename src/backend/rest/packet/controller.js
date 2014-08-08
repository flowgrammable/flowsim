var _ = require('underscore');
var utils = require('./controllerUtils.js');
var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){  
  events.Emitter.emit(id, result);
}

// ----------------------------------------------------------------------------
// Auth

function packetCreate(dataModel, session, method, params, data, ip, id) {
	if(method =='POST') {
    if(!data.name) return passback(id, msg.missingPacketName());
  	dataModel.packet.create(session.subscriber_id, data.name, function(result) {
      	passback(id, result);
  	});
	} else return passback(id, msg.methodNotSupported());
}

function packetList(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    dataModel.packet.list(session.subscriber_id, function(result){
        passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

function packetUpdate(dataModel, session, method, params, data, ip, id) {
  if(method =='PUT') {
    if(!data.id) return passback(id, msg.missingId());
    //if(data.subscriber_id) return passback(id, msg.notAuthorized());
    dataModel.packet.update(session.subscriber_id, data, function(result) {
      passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

function packetDestroy(dataModel, session, method, params, data, ip, id) {
  if(method =='DEL') {
    if(!params[1]) return passback(id, msg.missingId());
    var packetId = params[1];
    dataModel.packet.destroy(session.subscriber_id, packetId, function(result) {
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
      noauth: {
      },
      auth: {
        create: _.bind(packetCreate, null, dataModel),
        list: _.bind(packetList, null, dataModel),
        
      }
    }
  }
}

