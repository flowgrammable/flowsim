var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var msg = require('./msg');

var orm = require('../../dbbs');
var Subscriber = orm.model("subscriber");
var Session = orm.model("session");
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
  Subscriber.create({
    email: em,
    password: encrypted,
    reg_date: new Date(),
    reg_ip: ip, 
    verification_token: token,
    status: 'CREATED'
  }).success(function(result) {
    // console.log(result);
    fs.exists('temp', function (exists) {
      if(exists) {
        fs.writeFile('temp', token, function (err) {
          if (err) console.log('Unable to write token in file for restTest');
        });
      }
    });
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

function updateSubscriber(sub, newSubInfo, cb) {
  sub.updateAttributes(newSubInfo)
    .success(function(result) {
      cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

function sendVerificationEmail(subscriber, cb) {
  console.log(subscriber.values); 
  var email = subscriber.email;
  var token = subscriber.verification_token;
  mailer.sendMail(email, mailer.verificationMessage(token), function(result) {
		if (result.name) {
		 console.log(result);
		 cb(msg.unknownError());
		}
    else cb(msg.success());   
  });
}

exports.sendResetEmail = function(subscriber, cb){
	var email = subscriber.email;
	var resetToken = subscriber.reset_token;
	mailer.sendMail(email, mailer.resetMessage(resetToken), function(result){
		if(result.name){
			console.log(result);
			cb(msg.unknownError());
		}
		else cb(msg.success());
	});
}

function verifyRedirect(cb) {
	var tunnel = {code:302,
								headers: {'Location':'http://localhost:3000/#/login'}};
   cb(msg.success(null, tunnel));
}


// TODO: this has to link to a different frontend page
function resetRedirect(token, cb) {
  console.log('redirecting reset request');
  var tunnel = {code:302,
                headers: {'Location':'http://localhost:3000/#/reset/' + token}};
   cb(msg.success(null, tunnel));
}


exports.verifyRedirect = verifyRedirect;
exports.resetRedirect = resetRedirect;
exports.sendVerificationEmail = sendVerificationEmail;
exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;
exports.updateSubscriber = updateSubscriber;

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
