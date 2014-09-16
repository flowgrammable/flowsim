
var msg = require('./msg');

module.exports = function(db) {

var database = db;

function _createSubscriber(eml, pwd, date, ip, token, dispatch) {
  database.table('subscriber').create({
    email: eml,
    password: pwd,
    reg_date: date,
    reg_ip: ip,
    verification_token: token,
    status: 'CREATED'
  }).success(function(result) {
    dispatch(msg.success(result));
  }).error(function(err) {
    if(err.detail == 'Key (email)=(' + em + ') already exists.') {
      dispatch(msg.emailInUse()); 
    } else {
      dispatch(msg.unknownError(err));
    }
  });
}

function _fetchSubscriber(subInfo, dispatch) {
  database.table('subscriber').find({
    where: subInfo
  }).success(function(result) {
    if(result) {
      dispatch(msg.success(result));
    } else {
      dispatch(msg.subscriberNotFound());
    }
  }).error(function(err) {
    dispatch(msg.unknownError(err));
  });
}

function _updateSubscriber(sub, newSubInfo, dispatch) {
  database.table('subscriber').updateAttributes(newSubInfo)
    .success(function(result) {
      dispatch(msg.success(result));
    }).error(function(err) {
      dispatch(msg.unknownError(err));
    });
}

function _createSession(sub, skey, tmo, distpatch) {
  database.table('session').create({
    key: skey,
    subscriber_id: sub.id,
    timeout: tmo
  }).success(function(result) {
    dispatch(msg.success(result.key));
  }).error(function(err) {
    dispatch(msg.unknownError(err));
  });
}

function _fetchSession(skey, dispatch) {
  database.table('session').find({
    where: { key: skey } 
  }).success(function(result) {
    if(result) {
      dispatch(msg.success(result));
    } else {
      dispatch(msg.sessionNotFound());
    }
  }).error(function(err) {
    dispatch(msg.unknownError(err)); // probably db connection error
  });
}

function _destroySession(session, dispatch) {
  session.destroy()
    .success(function(result) {
      dispatch(msg.success());
    }).error(function(err) {
    dispatch(msg.unknownError(err));
  });
}

function _destroySessionLessThan(time, dispatch) {
  database.table('session').destroy({
    timeout: { lt: time } 
  }).success(function(result) { 
    dispatch(msg.success(result));
  }).error  (function(err) { 
    dispatch(msg.error(err));
  });
}

return {
  createSubscriber:       _createSubscriber,
  fetchSubscriber:        _fetchSubscriber,
  updateSubscriber:       _updateSubscriber,
  createSession:          _createSession,
  fetchSession:           _fetchSession,
  destroySession:         _destroySession,
  destroySessionLessThan: _destroySessionLessThan
};

};

