
var _ = require('underscore');

function subGetByEmail(db, email) {
  var i;
  for(i = 0; i < db.subscribers.length; ++i) {
    if(db.subscribers[i].email == email)
      return db.subscribers[i];
  }
  return {};
}
  
function sessGetByAccessToken(db, token) {
  var i;
  for(var i=0; i<db.sessions.length; ++i) {
    if(db.sessions[i].accessToken = accessToken)
      return db.session[i];
  }
  return null;
}

module.exports = function(db) {
  return {
    subscriber: {
      getByEmail: _.bind(subGetByEmail, null, db),
    },
    session: {
      getByAccessToken: _.bind(sessGetByAccessToken, null, db)
    }
  };
}

