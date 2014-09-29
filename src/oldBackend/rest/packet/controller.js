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

/*
 * packetCreate function is responsible for handling requests to 
 * api/packet/create. The http method must be POST for this service.
 * The request body is validated to ensure it contains a valid name 
 * and Openflow version, then the model function for create packet
 * is called with the given information.
 */
function packetCreate(dataModel, session, method, params, data, ip, id) {
	if(method =='POST') {
    if(!data.name) return passback(id, msg.missingPacketName());
  	dataModel.packet.create(session.subscriber_id, data.name, data.data, function(result) {
      	passback(id, result);
  	});
	} else return passback(id, msg.methodNotSupported());
}

/*
 * The packetList function is responsible for handling requests to 
 * api/packet/list. The http method must be GET for this service.
 * The model function for list packets is called with the session's 
 * subscriber_id.
 */
function packetList(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    dataModel.packet.list(session.subscriber_id, function(result){
        passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

/*
 * The packetDetail function is responsible for handling requests to 
 * api/packet/detail/id. The http method must be GET for this service.
 * The request's url is validated to ensure that it contains the id of
 * the packet of which to get the details. Next, the model function
 * for get packet details is called with the given packet id.
 */
function packetDetail(dataModel, session, method, params, data, ip, id) {
  if(method =='GET') {
    if(!params[1]) return passback(id, msg.missingId());
    var packetId = params[1];
    dataModel.packet.detail(session.subscriber_id, packetId, function(result) {
      passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

/*
 * The packetUpdate function is responsible for handling requests to 
 * api/packet/update. The http method must be PUT for this service.
 * The request body is validated to ensure it does not contain a
 * subscriber_id since this would allow one to change the packet's
 * linked subscriber. Next, the model function for create packet
 * is called with the given information.
 */
function packetUpdate(dataModel, session, method, params, data, ip, id) {
  if(method =='PUT') {
    if(!params[1]) return passback(id, msg.missingId());
		var packetId = params[1];
    if(!data.name) return passback(id, msg.missingPacketName());
    if(data.subscriber_id) return passback(id, msg.notAuthorized());
    dataModel.packet.update(session.subscriber_id, packetId, data, function(result) {
      passback(id, result);
    });
  } else return passback(id, msg.methodNotSupported());
}

/*
 * The packetDestroy function is responsible for handling requests to 
 * api/packet/destroy/id. The http method must be DEL for this 
 * service. The request's url is validated to ensure that it contains
 * the id of the packet to destroy. Next, the model function for
 * destroy packet is called with the given packet id.
 */
function packetDestroy(dataModel, session, method, params, data, ip, id) {
  if(method =='DELETE') {
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
        list:    _.bind(packetList, null, dataModel),
        detail:  _.bind(packetDetail, null, dataModel),
        update:  _.bind(packetUpdate, null, dataModel),
        destroy: _.bind(packetDestroy, null, dataModel)
      }
    }
  }
}

