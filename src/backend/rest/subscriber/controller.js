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

function subRegister(dataModel, method, params, data, ip, id) {
  // Provide some basic sanity checks
  if(!data.email) return passback(id, msg.missingEmail());
  if(utils.invalidEmail(data.email)) return passback(id, msg.badEmail(data.email));
  if(!data.password) return passback(id, msg.missingPwd());
  if(utils.invalidPassword(data.password)) return passback(id, msg.badPwd());

  dataModel.subscriber.create(data.email, data.password, ip, function(result){
      passback(id, result);
  });
}

function subVerify(dataModel, method, params, data, ip, id) {

  var token = data.token;
  // Ensure a verification token is present and valid
  if(!token) return passback(id, msg.missingVerificationToken());
  if(utils.invalidToken(token)) return passback(id, msg.badVerificationToken());

  dataModel.subscriber.verify(token, function(result){
      passback(id, result);
  });

}


function subForgotPassword(dataModel, method, params, data, ip, id) {
	// Phase 1 - POST {email:email}  -> Generate reset token and send email 
	
	var email = data.email;
  
	if (!email) return passback(id, msg.missingEmail());
  if (utils.invalidEmail(email)) return passback(id, msg.badEmail(data.email));
  dataModel.subscriber.forgotRequest(data.email, function(result){
    passback(id, result);
  });
}

function subResetPassword(dataModel, method, params, data, ip, id){
	// Phase 2 - POST { reset_token: reset_token, password: newPassword }

  var token = data.reset_token;
  if (!token) return passback(id, msg.missingResetToken());
  if (utils.invalidToken(token)) return passback(id, msg.badResetToken());

  var new_password = data.password;
  if (!new_password) return passback(id, msg.missingPwd());
  if (utils.invalidPassword(new_password)) return passback(id, msg.badPwd());

  dataModel.subscriber.passwordUpdate(token, new_password, function(result){
    passback(id, result);
  });
}

function subLogin(dataModel, method, params, data, ip, id) {
  if(!data.email) return passback(id, msg.missingEmail());
  if(utils.invalidEmail(data.email)) return passback(id, msg.badEmail(data.email));
  dataModel.session.authenticate(data.email, data.password,
  function(result){
    passback(id, result);
  });
}
    
function sessAuthenticate(dataModel, headers, cb) {
  if(headers['x-access-token']) { // header has x-access-token
	if(utils.invalidToken(headers['x-access-token'])) return cb(msg.badAccessToken());
    	dataModel.session.getByAccessToken(headers['x-access-token'],
    	function(result){
      		//console.log(result);
     		cb(result);
    });
  } else cb(null); // no x-access-token in the header
}

// ----------------------------------------------------------------------------
// Auth

function subLogout(dataModel, session, method, params, data, ip, id) {
  //console.log('attempting to destroy session');
  dataModel.session.destroy(session, 
  function(result) { 
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
    authenticate: _.bind(sessAuthenticate, null, dataModel),
    module: {
      noauth: {
        register: _.bind(subRegister, null, dataModel),
        verify: _.bind(subVerify, null, dataModel),
        forgotpassword: _.bind(subForgotPassword, null, dataModel),
        resetpassword: _.bind(subResetPassword, null, dataModel),
        login: _.bind(subLogin, null, dataModel)
      },
      auth: {
        logout: _.bind(subLogout, null, dataModel)
      }
    }
  }
}

