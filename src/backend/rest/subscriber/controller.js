
var _ = require('underscore');
var msg = require('./msg');
var model = require('./model');

function subRegister(dataModel, method, params, data) {
  // Provide some basic sanity checks
  if(!data.email) return msg.missingEmail();
  if(badEmail(data.email)) return msg.badEmail(data.email);
  if(!data.password) return msg.missingPwd();
  if(badPassword(data.password)) return msg.badPwd();

  // Attempt to create the user
  msg.unwrap(dataModel.subscriber.create(data.email, data.password),
    function(succ) {
      // generate email with url to result
      return msg.success();
    });
}

function subVerify(dataModel, method, params, data) {
  if(!data.token)
    return msg.missingToken();
  var result = dataModel.subscriber.verify(data.token);
  if(result == "badToken") return msg.badToken();
  if(result == "badState") return msg.badState();
  return msg.success();
}

function subReset(dataModel, method, params, data) {
}

function subLogin(dataModel, method, params, data) {
  var result;
  if(!data.email || !data.password) {
    return msg.badPassword();
  }
  
  result = dataModel.getByEmail(data.email);
  if(!result.password || data.password != result.password) {
    return msg.badPassword();
  }
  return msg.goodLogin('onebigfuckingstringz');
}

function subLogout(dataModel, session, method, params, data) {
  return msg.good();
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

