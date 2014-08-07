var _ = require('underscore');
//var utils = require('./controllerUtils.js');
var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){  
  // filter out results here
  events.Emitter.emit(id, result);
}

// ----------------------------------------------------------------------------
// Auth

function packetCreate(dataModel, session, method, params, data, ip, id) {
	if(method =='POST') {
    if(!data.name) return passback(id, msg.missingPacketName());
  	dataModel.packet.packCreate(session, data.name, function(result){
      	passback(id, result);
  	});
	} else return passback(id, msg.methodNotSupported());
}

function packetList(dataModel, session, method, params, data, ip, id) {
  if(method =='POST') {
    dataModel.packet.packList(session, function(result){
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
        list: _.bind(packetList, null, dataModel)
      }
    }
  }
}

