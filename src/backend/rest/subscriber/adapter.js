var uuid = require('node-uuid');

var msg = require('./msg');

var orm = require('../../dbbs');
var Subscriber = orm.model("subscriber");
var mailer = require('../../mailer');
// function insertSubscriber(email, password, cb){
// 	setTimeout(function(){
// 		cb(msg.emailInUse());
// 	}, 3000);
// }

function insertSubscriber(em, pwd, cb){
  var token = uuid.v4();
  Subscriber.create({
    email: em,
    password: pwd,
    reg_date: new Date(),
    reg_ip: '127.0.0.1',
    verification_token: token,
    status: 'REGISTERED'
  }).success(function(result){
    // console.log(result);
    cb(msg.success(result));
  }).error(function(err){
    // console.log(err);
    if (err.detail == 'Key (email)=(' + em + ') already exists.')
      cb(msg.emailInUse());
    else
     cb(msg.unknownError(err));
  });

}

function fetchSubscriber(sub, cb){
  Subscriber.find({ where: sub })
    .success(function(result) {
      if (result == null) cb(msg.subscriberNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}


function verifySubscriber(sub, cb){
  if (sub.status == 'VERIFIED') 
    cb(msg.subscriberAlreadyVerified());
  else {
    sub.status = 'VERIFIED';
    sub.save()
      .success(function(result) {
        cb(msg.success(result));
      }).error(function(err) {
        cb(msg.unknownError(err)); // probably db connection error
      });
  }
}

/*
function sendVerificationEmail(email, cb){
	setTimeout(function(){
		cb(msg.error('Cant send Email'));
	}, 3000);
}
*/

function sendVerificationEmail(subscriber, cb){
    console.log(subscriber.values); 
    var email = subscriber.values.email;
    var token = subscriber.values.verification_token;
    mailer.sendMail(email, mailer.verificationMessage(token), function(result){
      cb(msg.success());
    });
}

function comparePassword(subscriber, cb){
  console.log(subscriber);


}

exports.sendVerificationEmail = sendVerificationEmail;
exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;
exports.verifySubscriber = verifySubscriber;
exports.comparePassword = comparePassword;
