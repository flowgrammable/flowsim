var msg = require('./msg');

var orm = require('../dbbs');
var Session = orm.model("session");


function insertSession(sessId, ipIn, cb){
  Session.create({
    session_id: sessId,
    begin_time: new Date(),
    ip: ipIn, 
    status: 'UNAUTHENTICATED'
  }).success(function(result){
    console.log(result);
    cb(msg.success(result));
  }).error(function(err){
    console.log(err);
    cb(msg.unknownError(err));
  });
}

function authenticateSession(sessId, subId, cb){
  Session.find({ where: { session_id: sessId } })
    .success(function(result) {
      if (result == null) cb(msg.sessionNotFound());
      else {
        var session = result.value; // session that was retrieved
        session.status = 'AUTHENTICATED';
        session.subscriber_id = subId;
        session.save()
          .success(function(result) {
            cb(msg.success(result));
          }).error(function(err) {
            cb(msg.unknownError(err)); // probably db connection error
          });
      }
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

exports.insertSession = insertSession;
exports.authenticateSession = authenticateSession;
