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
    console.log(result);
    cb(msg.success(result));
  }).error(function(err){
    console.log(err);
    if (err.detail == 'Key (email)=(' + em + ') already exists.')
      cb(msg.emailInUse());
    // TODO: check if the issue is the database connection
    // else
    //  cb(msg.noDatabaseConnection());
  });

}

function fetchSubscriber(sub, cb){
  Subscriber.find({ where: sub })
  .success(function(result) {
    cb(msg.success(result));
  }).error(function(record) {
    cb(msg.subscriberNotFound());
  })
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

exports.sendVerificationEmail = sendVerificationEmail;
exports.insertSubscriber = insertSubscriber;
