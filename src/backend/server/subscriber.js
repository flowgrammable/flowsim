
var _ = require('underscore');
var msg = require('./msg');
var model = require('./model');

function subRegister(dataModel, method, params, data) {
  return msg.success({});
}

function subVerify(dataModel, method, params, data) {
  return msg.success({});
}

function subReset(dataModel, method, params, data) {
  return msg.success({});
}

function subLogin(dataModel, method, params, data) {
  var result;
  if(!data.email || !data.password) {
    return msg.error({
      description: 'Bad email or password'
    });
  }
  
  result = dataModel.getByEmail(data.email);
  if(!result.password || data.password != result.password) {
    return msg.error({
      description: 'Bad password'
    });
  }
  return msg.success({}, {
    'X-Access-Token': 'onebigfuckingstringz'
  });
}

function subLogout(dataModel, session, method, params, data) {
  return msg.success({});
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

