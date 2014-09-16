
var msg = require('./msg');

exports.module = function(db) {

var database = db;

function _createSubscriber(eml, pwd, ip, token, dispatch) {
  database.table('subscriber').create({
    email: eml,
    password: pwd,
    reg_date: new Date(),
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

return {
  createSubscriber: _createSubscriber
};

}

