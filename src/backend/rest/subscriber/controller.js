var _ = require('underscore');

var events = require('../../events');
var msg = require('./msg');
var model = require('./model');

function passback(id, result, nextFunction){  
  events.Emitter.emit(id, result);
}

function subRegister(dataModel, method, params, data, id) {
  // Provide some basic sanity checks
  if(!data.email) return passback(id, msg.missingEmail());
  //if(badEmail(data.email)) return msg.badEmail(data.email);
  if(!data.password) return passback(id, msg.missingPwd());
  //if(badPassword(data.password)) return msg.badPwd();

  dataModel.subscriber.create(data.email, data.password, function(result){
      passback(id, result);
  });
}

function subVerify(dataModel, method, params, data) {
  // Ensure a verification token is present
  if(!data.token) return msg.missingToken();
  // Return the result of verification
  return dataModel.subscriber.verify(data.token);
}

function subReset(dataModel, method, params, data) {
  // Ensure email is present and valid
  if(!data.email) return msg.missingEmail();
  if(badEmail(data.email)) return msg.badEmail(data.email);
  // Return the result of password reset
  msg.test(dataModel.subscriber.reset(data.email),
    function(succ) {
      // generate email with the url to present
      return msg.success();
    });
}

function subLogin(dataModel, method, params, data) {
  if(!data.email) return msg.missingEmail();
  if(badEmail(data.email)) return msg.badEmail(data.email);
  //if(!data.
  msg.test(dataModel.login(data.email, data.password),
    //Incorrect Password??
    //User is registered but not verified??
    function(succ) {
      // pass back the X-Access-Token 
      return msg.success();
    });
}

function subLogout(dataModel, session, method, params, data) {
  return msg.success();
}
    
function sessAuthenticate(dataModel, headers) {
  if(headers['X-Access-Token']) {
    return dataModel.session.getByAccessToken(headers['X-Access-Token']);
  }
  return null;
}

module.exports = function(db) {
  var dataModel = model(db); 
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

