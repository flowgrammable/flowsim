
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

exports.missingPacketName = function() {
  return msg.error({
    system: "packet/controller",
    type: "missingPacketName"
  });
}

