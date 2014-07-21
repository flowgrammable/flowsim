
msg = require('../msg');

exports.success = msg.success;
exports.error = msg.error;
exports.test = msg.test;

exports.noDatabaseConnection = function() {
  return msg.error({
    system: "subscriber/adapter",
    type: "noDatabaseConnection"
  });
}

exports.unknownError = function() {
  return msg.error({
    system: "subscriber/adapter",
    type: "unknownError"
  });
}

exports.subscriberNotFound = function() {
  return msg.error({
    system: "subscriber/model",
    type: "subscriberNotFound"
  });
}

exports.emailInUse = function() {
  return msg.error({
    system: "subscriber/model",
    type: "emailInUse"
  });
}

exports.missingEmail = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingEmail"
  });
}

exports.badEmail = function(email) {
  return msg.error({
    system: "subscriber/controller",
    type: "badEmail",
    email: email
  });
}

exports.incorrectPwd = function() {
  return msg.error({
    system: "subscriber/model",
    type: "incorrectPwd"
  });
}

exports.missingPwd = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingPwd"
  });
}

exports.badPwd = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "badPwd"
  });
}

exports.missingVerificationToken = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingVerificationToken"
  });
}

exports.badVerificationToken = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "badVerificationToken"
  });
}

exports.missingAccessToken = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingAccessToken"
  });
}

exports.badAccessToken = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "badAccessToken"
  });
}

exports.accessTokenExpired = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "accessTokenExpired"
  });
}

exports.subscriberNotActive = function() {
  return msg.error({
    system: "subscriber/model",
    type: "subscriberNotActive"
  });
}

// replace with subscriberNotActive?
exports.unverifiedSubscriber = function() {
  return msg.error({
    system: "subscriber/model",
    type: "unverifiedSubscriber"
  });
}

exports.subscriberAlreadyVerified = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "subscriberAlreadyVerified"
  });
}

exports.badConfig = function() {
  return msg.error({
    system: "subscriber/adapter",
    type: "badEmailConfiguration"
  })
}


