var msg = require('./msg');

var orm = require('../dbbs');
var Session = orm.model("session");


function insertSession(sess_id, ip_in, cb){
  Session.create({
    session_id: sess_id,
    begin_time: new Date(),
    ip: ip_in, 
    status: 'UNAUTHENTICATED'
  }).success(function(result){
    // console.log(result);
    cb(msg.success(result));
  }).error(function(err){
    console.log(err);
    cb(msg.unknownError(err));
  });

}


exports.insertSession = insertSession;
