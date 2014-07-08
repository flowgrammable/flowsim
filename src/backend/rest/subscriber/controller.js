var events = require('../../events');
var _ = require('underscore');
var async = require('async');
var msg = require('./msg');
var model = require('./modeldb');
var orm = require('../../dbbs');

/*
1. Create user
2. check for success or error
3. if success, sendemail
   if error, go back to rest controller
4. check sendmail error or success
5. if success, send success
   if error, send error
*/

function passback(id, result){
  events.Emitter.emit(id, result);
}

function subRegister(dataModel, method, params, data, id) {
  // Provide some basic sanity checks
  if(!data.email) return passback(id, msg.missingEmail());
  //if(badEmail(data.email)) return msg.badEmail(data.email);
  if(!data.password) return passback(id, msg.missingPwd());
  //if(badPassword(data.password)) return msg.badPwd();


  
  dataModel.subscriber.create(data.email, data.password, function(result){
      console.log('the id is: ', id);
      events.Emitter.emit(id, result);
  });




/*  // Attempt to create the user
 msg.test(dataModel.subscriber.create(data.email, data.password),
    function(succ) {
      // generate email with url to present
      // dataModel.subscriber.sendVerification(token);
      return msg.success();
    });
*/
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
  var Subscriber = orm.model("subscriber"); 
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

