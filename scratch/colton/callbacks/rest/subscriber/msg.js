msg = require('../msg');

exports.error = msg.error;
exports.success = msg.success;

exports.missingEmail = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingEmail"
  });
}