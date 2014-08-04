var _ = require('underscore');
var utils = require('./controllerUtils.js');
var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){  
  // filter out results here
  events.Emitter.emit(id, result);
}

// ----------------------------------------------------------------------------
// Noauth


// ----------------------------------------------------------------------------
// Auth

function packetCreate(dataModel, session, method, params, data, ip, id) {
	if(method =='POST') {
  	if(!data.oldPassword) return passback(id, msg.missingPwd());
  	if(!data.newPassword) return passback(id, msg.missingPwd());
  	if(utils.invalidPassword(data.newPassword)) return passback(id, msg.badPwd());
  	dataModel.subscriber.editPasswd(session, data.oldPassword, data.newPassword, function(result){
      	passback(id, result);
  	});
	} else return passback(id, msg.methodNotSupported());
}
// ----------------------------------------------------------------------------

module.exports = function(testAdapter) {
  var dataModel;
	//if(testAdapter){
	//	dataModel = model(testAdapter);
  //} else {
		dataModel = model();
	//} 
  return {
    authenticate: _.bind(sessAuthenticate, null, dataModel),
    module: {
      noauth: {
      },
      auth: {
        create: _.bind(packetCreate, null, dataModel),
        list: _.bind(packetList, null, dataModel)
        update: _.bind(packetUpdate, null, dataModel)
        read: _.bind(packetRead, null, dataModel)
      }
    }
  }
}

