
msg = require('../msg');

exports.success = msg.success;
exports.error = msg.error;
exports.test = msg.test;

exports.methodNotSupported = function() {
  return msg.error({
    system: "profile/controller",
    type: "methodNotSupported"
  })
}

exports.unknownError = function() {
  return msg.error({
    system: "profile/adapter",
    type: "unknownError"
  });
}

exports.profileNotFound = function() {
  return msg.error({
    system: "profile/adapter",
    type: "profileNotFound"
  });
}

exports.missingName = function() {
  return msg.error({
    system: "profile/controller",
    type: "missingName"
  });
}

exports.missingId = function() {
  return msg.error({
    system: "profile/controller",
    type: "missingId"
  });
}

exports.missingOfpVersion = function() {
  return msg.error({
    system: "profile/controller",
    type: "missingOfpVersion"
  });
}

exports.invalidOfpVersion = function() {
  return msg.error({
    system: "profile/controller",
    type: "invalidOfpVersion"
  });
}

exports.notAuthorized = function() {
  return msg.error({
    system: "profile/controller",
    type: "notAuthorized"
  });
}
