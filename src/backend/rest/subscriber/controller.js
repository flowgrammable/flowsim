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
  if(utils.invalidPassword(data.password) ) return passback(id, msg.badPwd());

  dataModel.subscriber.create(data.email, data.password, ip, function(result){
      passback(id, result);
  });
}

function subVerify(dataModel, method, params, data, ip, id) {

  var token = params[1];
  // Ensure a verification token is present and valid
  if(!token) return passback(id, msg.missingVerificationToken());
  if(utils.invalidToken(token)) return passback(id, msg.badVerificationToken());

  dataModel.subscriber.verify(token, function(result){
      passback(id, result);
  });

}

function subReset(dataModel, method, params, data, ip, id) {
  // Ensure email is present and valid
  if(!data.email) return msg.missingEmail();
  if(utils.invalidEmail(data.email)) return passback(id, msg.badEmail(data.email));
  // Return the result of password reset
  dataModel.subscriber.reset(data.email, function(result){
    passback(id, result);
  })
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
    dataModel.session.getByAccessToken(headers['x-access-token'],
    function(result){
      console.log(result);
      cb(result);
    });
  } else cb(null); // no x-access-token in the header
}

// ----------------------------------------------------------------------------
// Auth

function subLogout(dataModel, session, method, params, data, ip, id) {
  console.log('attempting to destroy session');
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
        reset: _.bind(subRegister, null, dataModel),
        login: _.bind(subLogin, null, dataModel)
      },
      auth: {
        logout: _.bind(subLogout, null, dataModel)
      }
    }
  }
}

