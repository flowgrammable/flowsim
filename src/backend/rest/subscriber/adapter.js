var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

var msg = require('./msg');

var orm = require('../../dbbs');
orm.setup();
var Subscriber = orm.model("subscriber");
var mailer = require('../../mailer');


// The insertSubscriber function creates a table entry for a 
// subscriber with the provided email address and password. Upon 
// successful completion, a success message is sent containing the 
// resulting subscriber. Failure due to the email address already 
// existing in the database results in an  emailInUse() message 
// being sent to the callback function.
function insertSubscriber(em, pwd, cb){
  var token = uuid.v4();
  var encrypted = bcrypt.hashSync(pwd, 10); // encrypt the password
  // syntax to compare the password:
  // bcrypt.compareSync("pass input by user", subscriber.password);
  Subscriber.create({
    email: em,
    password: encrypted,
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

// The fetchSubscriber function retrieves a table entry from the 
// subscribers table based on the provided information. Upon 
// successful completion, a success message is sent containing
// the retrieved subscriber. Failure due to no subscriber being
// found results in a subscriberNotFound() message being sent
// to the callback function.
function fetchSubscriber(subInfo, cb){
  Subscriber.find({ where: subInfo })
    .success(function(result) {
      if (result == null) cb(msg.subscriberNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

// The verifySubscriber method changes the 'status' attribute of a
// subscriber from 'REGISTERED' to 'VERIFIED'. Upon successful
// completion, a success message is sent containing the updated
// subscriber. Failure as a result of the subscriber having already 
// been verified results in a subscriberAlreadyVerified() message 
// being sent to the callback function.
//
// Note: in this function 'sub' must be an instance of the dbmodel. 
// This allows us to modify and save it, updating the corresponding 
// entry in the database's subscribers table.
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
