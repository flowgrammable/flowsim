
module.exports = function(db) {
  var database = db;
  function subscriber_lookup(email) {
    var i;
    for(i = 0; i < database.subscribers.length; ++i) {
      if(database.subscribers[i].email == email)
        return database.subscribers[i];
    }
    return {};
  }

  function lookupAccessToken(token) {
    var i;
    for(var i=0; i<database.sessions.length; ++i) {
      if(database.sessions[i].accessToken = accessToken)
        return database.session[i];
    }
    return null;
  }
}

