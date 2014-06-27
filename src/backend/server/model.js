
var _ = require('underscore');

function subscriberLookup(db, email) {
  var i;
  for(i = 0; i < db.subscribers.length; ++i) {
    if(db.subscribers[i].email == email)
      return db.subscribers[i];
  }
  return {};
}
  
function lookupAccessToken(db, token) {
  var i;
  for(var i=0; i<db.sessions.length; ++i) {
    if(db.sessions[i].accessToken = accessToken)
      return db.session[i];
  }
  return null;
}

module.exports = function(db) {
  return {
    subscriber_lookup: _.bind(subscriberLookup, null, db),
    lookupAccessToken: _.bind(lookupAccessToken, null, db)
  };
}

