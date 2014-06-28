
var _ = require('underscore');
var uuid = require('node-uuid');
var msg = require('./msg');

// Start subscriber ids from some random 5 digit prime
var base = 19543;

function subGetById(db, id) {
  var table = db.subscribers;
  id -= base;
  if(id < 0 || id >= table.length)
    return null;
  return table[id];
}

function subGetByField(db, key, value) {
  var table = db.subscribers;
  var result = _.find(table, function(_row) {
    return _row[key] == value;
  });
  if(typeof(result) == 'undefined') return null;
  else return result;
}

function _subCreate(db, row) {
  if(subGetByField(db, "email", row.email)) {
    return msg.emailInUse();
  } else {
    table.push(row);
    return msg.success(row);
  }
}

function subCreate(db, em, pwd) {
  msg.unwrap(_subCreate(db, {
    email: em, 
    password: pwd,
    state: "CREATED",
    verification: uuid.v4()
  }), function(row) {
    return msg.success(row.verification);
  });
}

function subVerify(db, token) {
  var exists = subGetByField(db, "verfication", token);
  if(!exists) return msg.badToken();
  if(exists.state != 'CREATED') return msg.badVerificationState();
  exists.state = 'ACTIVE';
  return msg.success();
}

function subReadById(db, id) {
  var table = db.subscribers;
  id -= base;
  if(id < 0 || id >= table.length)
    return "badId";
  return table[id];
}

function subReadByEmail(db, email) {
  var table = db.subscribers;
  var row = _.find(table, function(_row) {
    if(email == _row.email) return true;
    else return false;
  });
  if(!row) return "badEmail";
  return row;
}

function subUpdate(db, id, row) {
  var table = db.subscribers;
  id -= base;
  if(id < 0 || id >= table.length) return "badId";
  table[id] = row;
  return "";
}

function subDestroy(db, id) {
  var table = db.subscribers;
  id -= base;
  if(id < 0 || id >= table.length) return "badId";
  table.splice(id, 1);
  return "";
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
      create: _.bind(subCreate, null, db),
      verify: _.bind(subVerify, null, db),

      readById: _.bind(subReadById, null, db),
      readByEmail: _.bind(subReadByEmail, null, db),
      update: _.bind(subUpdate, null, db),
      destroy: _.bind(subDestroy, null, db)
    },
    session: {
      create: _.bind(sessCreate, null, db),
      destroy: _.bind(sessDestroy, null, db),
      authenticate: _.bind(sessAuthenticate, null, db);

      getByAccessToken: _.bind(sessGetByAccessToken, null, db)
    }
  };
}

