
msg = require('../msg');

exports.success = msg.success;
exports.error = msg.error;
exports.test = msg.test;

exports.methodNotSupported = function() {
	return msg.error({
		system: "packet/controller",
		type: "methodNotSupported"
	})
}

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


exports.missingPacketName = function() {
  return msg.error({
    system: "packet/controller",
    type: "missingPacketName"
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

exports.subscriberClosed = function() {
  return msg.error({
    system: "subscriber/model",
    type: "subscriberClosed"
  });
}

exports.badConfig = function() {
  return msg.error({
    system: "subscriber/adapter",
    type: "badEmailConfiguration"
  })
}

exports.sessionNotFound = function() {
  return msg.error({
    system: "subscriber/adapter",
    type: "sessionNotFound"
  })
}
