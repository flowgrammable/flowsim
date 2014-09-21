
(function(){

var fmt = require('../utils/formatter');
var msg = require('./msg');

function Storage(db) {
  this.database = db;
  this.database.loadLocalModels(__dirname);
}
exports.Storage = Storage;

Storage.prototype.toFormatter = function(f) {
  f.begin('Storage');
  this.database.toFormatter(f);
  f.end();
};

Storage.prototype.toString = fmt.toString;

Storage.prototype.createSubscriber = function(eml, pwd, date, ip, token, 
  dispatch) {

  this.database.table('subscriber').create({
    email: eml,
    password: pwd,
    reg_date: date,
    reg_ip: ip,
    verification_token: token,
    status: 'CREATED'
  }).success(function(result) {
    dispatch(undefined, result);
  }).error(function(err) {
    if(err) {
      //err.detail == 'Key (email)=(' + eml + ') already exists.') {
      //dispatch(msg.emailInUse()); 
      dispatch(err);
    } else {
      dispatch(msg.unknownError(err));
    }
  });
};

Storage.prototype.getSubscriber = function(subInfo, dispatch) {
  this.database.table('subscriber').find({
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
};

Storage.prototype.updateSubscriber = function(sub, newSubInfo, dispatch) {
  this.database.table('subscriber').updateAttributes(newSubInfo)
    .success(function(result) {
      dispatch(msg.success(result));
    }).error(function(err) {
      dispatch(msg.unknownError(err));
    });
};

Storage.prototype.createSession = function(sub, skey, tmo, distpatch) {
  this.database.table('session').create({
    key: skey,
    subscriber_id: sub.id,
    timeout: tmo
  }).success(function(result) {
    dispatch(msg.success(result.key));
  }).error(function(err) {
    dispatch(msg.unknownError(err));
  });
};

Storage.prototype.getSession = function(skey, dispatch) {
  this.database.table('session').find({
    where: { key: skey } 
  }).success(function(result) {
    if(result) {
      dispatch(undefined, result);
    } else {
      dispatch(msg.sessionNotFound());
    }
  }).error(function(err) {
    dispatch(msg.unknownError(err)); // probably db connection error
  });
};

Storage.prototype.deleteSession = function(session, dispatch) {
  this.session.destroy()
    .success(function(result) {
      dispatch(msg.success());
    }).error(function(err) {
    dispatch(msg.unknownError(err));
  });
};

Storage.prototype.deleteStaleSession = function(time, dispatch) {
  this.database.table('session').destroy({
    timeout: { lt: time } 
  }).success(function(result) { 
    dispatch(msg.success(result));
  }).error  (function(err) { 
    dispatch(msg.error(err));
  });
};

})();


