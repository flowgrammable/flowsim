
var _ = require('underscore');
var msg = require('./msg');
var model = require('./model');

function subscriberRegister(model, method, params, data) {
  return msg.success({});
}

function subscriberVerify(model, method, params, data) {
  return msg.success({});
}

function subscriberReset(model, method, params, data) {
  return msg.success({});
}

function subscriberLogin(model, method, params, data) {
  var result;
  if(!data.email || !data.password) {
    return msg.error({
      description: 'Bad email or password'
    });
  }
  
  result = model.subscriber_lookup(data.email);
  if(!result.password || data.password != result.password) {
    return msg.error({
      description: 'Bad password'
    });
  }
  return msg.success({}, {
    'X-Access-Token': 'onebigfuckingstringz'
  });
}

function subscriberLogout(model, session, method, params, data) {
  return msg.success({});
}

module.exports = function(db) {
  var subModel = model(db);
  return {
    getSession: function(headers) {
      if(headers['X-Access-Token']) {
        return subModel.lookupAccesstoken(headers['X-Access-Token']);
      }
      return null;
    },
    module: {
      noauth : {
        register : _.bind(subscriberRegister, null, subModel),
        verify : _.bind(subscriberVerify, null, subModel),
        reset : _.bind(subscriberRegister, null, subModel),
        login : _.bind(subscriberLogin, null, subModel)
      },
      auth : {
        logout : _.bind(subscriberLogout, null, subModel)
      }
    }
  }
}

