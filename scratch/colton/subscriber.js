
var msg = require('./msg');

var db = {
  subscribers: [
    {
      subscriberId: 1,
      name: "Jasson Casey",
      email: "jasson.casey@gmail.com",
      password: "iluvflowg"
    }
  ],
  sessions: [
    {
      sessionId: '123456',
      accessToken: 'asdfasdf',
      subscriberId: 2
    }
  ]
}

function subscriber_lookup(email) {
  var i;
  for(i = 0; i < db.subscribers.length; ++i) {
    if(db.subscribers[i].email == email)
      return db.subscribers[i];
  }
  return {};
}

function lookupAccessToken(token) {
  var i;
  for(var i=0; i<db.sessions.length; ++i) {
    if(db.sessions[i].accessToken = accessToken)
      return db.session[i];
  }
  return null;
}

function subscriberLogin(method, params, data) {
  var result;
  if(!data.email || !data.password) {
    return msg.error({
      description: 'Bad email or password'
    });
  }
  
  result = subscriber_lookup(data.email);
  if(!result.password || data.password != result.password) {
    return msg.error({
      description: 'Bad password'
    });
  }
  return msg.success({}, {
    'X-Access-Token': 'onebigfuckingstringz'
  });
}

function subscriberRegister(method, params, data){
   if(!data.email || !data.password){
			return msg.error({
				description: 'Bad email or password'
			});
   }
   return msg.success({'regstatus':'success'});
}

exports.getSession = function(headers) {
  if(headers['X-Access-Token']) {
    return lookupAccesstoken(headers['X-Access-Token']);
  }
  return null;
}

exports.module = {
  noauth : {
    register : subscriberRegister
    //verify : subscriberVerify,
   // reset : subscriberRest,
  //  login : subscriberLogin
  },
  auth : {
//    logout : subscriberLogout
  }
}

