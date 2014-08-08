
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
    system: "packet/adapter",
    type: "noDatabaseConnection"
  });
}

exports.unknownError = function() {
  return msg.error({
    system: "packet/adapter",
    type: "unknownError"
  });
}

exports.missingPacketName = function() {
  return msg.error({
    system: "packet/controller",
    type: "missingPacketName"
  });
}

exports.packetNotFound = function() {
  return msg.error({
    system: "packet/adapter",
    type: "packetNotFound"
  });
}

exports.missingId = function() {
  return msg.error({
    system: "packet/controller",
    type: "missingId"
  });
}

exports.notAuthorized = function() {
  return msg.error({
    system: "packet/controller",
    type: "notAuthorized"
  });
}

