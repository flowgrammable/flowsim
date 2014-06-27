
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

