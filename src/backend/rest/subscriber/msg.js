
msg = require('../msg');

exports.success = msg.success;
exports.error = msg.error;
exports.test = msg.test;

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

exports.badEmail = function(em) {
  return msg.error({
    system: "subscriber/controller",
    type: "badEmail",
    email: em
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

exports.missingToken = function() {
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

