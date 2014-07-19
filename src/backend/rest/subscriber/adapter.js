var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var msg = require('./msg');

var orm = require('../../dbbs');
var Subscriber = orm.model("subscriber");
var Session = orm.model("session");
// var Authtoken = orm.model("authtoken");
var mailer = require('../../mailer');
var fs = require('fs');

// ----------------------------------------------------------------------------
// Subscriber

// The insertSubscriber function creates a table entry for a 
// subscriber with the provided email address and password. Upon 
// successful completion, a success message is sent containing the 
// resulting subscriber. Failure due to the email address already 
// existing in the database results in an  emailInUse() message 
// being sent to the callback function.
function insertSubscriber(em, pwd, ip, cb) {
  var token = uuid.v4();
  var encrypted = bcrypt.hashSync(pwd, 10); // encrypt the password
  fs.exists('temp', function (exists) {
    if(exists) {
      fs.writeFile('temp', token, function (err) {
        if (err) console.log('Unable to write token in file for restTest');
      });
    }
  });
  // syntax to compare the password:
  // bcrypt.compareSync("pass input by user", subscriber.password);
  Subscriber.create({
    email: em,
    password: encrypted,
    reg_date: new Date(),
    reg_ip: ip, 
    verification_token: token,
    status: 'CREATED'
  }).success(function(result) {
    // console.log(result);
    cb(msg.success(result));
  }).error(function(err) {
     console.log(err);
    if(err.detail == 'Key (email)=(' + em + ') already exists.')
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
function fetchSubscriber(subInfo, cb) {
  Subscriber.find({ where: subInfo })
    .success(function(result) {
      if (result == null) cb(msg.subscriberNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

// The verifySubscriber function changes the 'status' attribute of 
// a subscriber from 'REGISTERED' to 'VERIFIED'. Upon successful
// completion, a success message is sent containing the updated
// subscriber. Failure as a result of the subscriber having already 
// been verified results in a subscriberAlreadyVerified() message 
// being sent to the callback function.
//
// Note: in this function 'sub' must be an instance of the dbmodel. 
// This allows us to modify and save it, updating the corresponding 
// entry in the database's subscribers table.
function verifySubscriber(sub, cb) {
  if (sub.status == 'ACTIVE') 
    cb(msg.subscriberAlreadyVerified());
  else {
    sub.status = 'ACTIVE'; // set the status to active
    sub.save()
      .success(function(result) {
        cb(msg.success(result));
      }).error(function(err) {
        cb(msg.unknownError(err)); // probably db connection error
      });
  }
}

function sendVerificationEmail(subscriber, cb) {
  console.log(subscriber.values); 
  var email = subscriber.values.email;
  var token = subscriber.values.verification_token;
  mailer.sendMail(email, mailer.verificationMessage(token), function(result) {
		if (result.name) {
		 console.log(result);
		 cb(msg.unknownError());
		}
    else cb(msg.success());   
  });
}

exports.sendResetEmail = function(subscriber, cb){
	var email = subscriber.values.email;
	var resetToken = subscriber.values.reset_token;
	mailer.sendMail(email, mailer.resetMessage(resetToken), function(result){
		if(result.name){
			console.log(result);
			cb(msg.unknownError());
		}
		else cb(msg.success());
	});
}


// given subscriber, generate reset token
exports.generateResetToken = function(subscriber, cb){
	// if reset_token associated with subscriber.id exists
  // then expire the reset_token
  // then generate a new token associated with the subscriber id
  // and pass the token string back with cb(msg.success(resetToken))
}

function verifyRedirect(cb) {
	var tunnel = {code:302,
								headers: {'Location':'http://localhost:3000/#/login'}};
   cb(msg.success(null, tunnel));
}



exports.verifyRedirect = verifyRedirect;
exports.sendVerificationEmail = sendVerificationEmail;
exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;
exports.verifySubscriber = verifySubscriber;

// ----------------------------------------------------------------------------
// Session

function createSession(sub, cb) {
  var sessKey = uuid.v4();
  var newTimeout = new Date();
  newTimeout.setDate(newTimeout.getDate() + 1);
  Session.create({
    key: sessKey,
    subscriber_id: sub.id,
    timeout: newTimeout.valueOf()
  }).success(function(result) {
    console.log(result);
    cb(msg.success(result.key));
  }).error(function(err) {
    console.log(err);
    cb(msg.unknownError(err));
  });
}

function fetchSession(sessKey, cb) {
  Session.find({ where: { key: sessKey } })
    .success(function(result) {
      if (result == null) cb(msg.sessionNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

function destroySession(session, cb) {
  session.destroy()
    .success(function(result) {
      cb(msg.success());
    })
    .error(function(err) {
      console.log(err);
      cb(msg.unknownError(err));
    });
}

function clearTimeouts() {
  setInterval(function() { 
    console.log("**Checking sessions table and deleting timedout sessions**");
    var currTime = new Date().valueOf();
    Session.destroy({ timeout: { lt: currTime } })
      .success(function(result) { console.log("Rows deleted: " + result); })
      .error  (function(err)    { console.log(err); });
  }, 86400000 /* milliseconds in a day */ );
}

exports.createSession = createSession;
exports.fetchSession = fetchSession;
exports.destroySession = destroySession;
exports.clearTimeouts = clearTimeouts;
