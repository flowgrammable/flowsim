
/**
 * @module subscriber
 */

(/** @lends module:subscriber */function(){

exports.methodNotSupported = function() {
	return {
		system: "subscriber/controller",
		type: "methodNotSupported"
	};
};

exports.noDatabaseConnection = function() {
  return {
    system: "subscriber/adapter",
    type: "noDatabaseConnection"
  };
};

exports.unknownError = function() {
  return {
    system: "subscriber/adapter",
    type: "unknownError"
  };
};

exports.subscriberNotFound = function() {
  return {
    system: "subscriber/model",
    type: "subscriberNotFound"
  };
};

exports.emailInUse = function() {
  return {
    system: "subscriber/model",
    type: "emailInUse"
  };
};

exports.missingEmail = function() {
  return {
    system: "subscriber/controller",
    type: "missingEmail"
  };
};

exports.badEmail = function(email) {
  return {
    system: "subscriber/controller",
    type: "badEmail",
    email: email
  };
};

exports.incorrectPwd = function() {
  return {
    system: "subscriber/model",
    type: "incorrectPwd"
  };
};

exports.missingPwd = function() {
  return {
    system: "subscriber/controller",
    type: "missingPwd"
  };
};

exports.badPwd = function() {
  return {
    system: "subscriber/controller",
    type: "badPwd"
  };
};

exports.missingResetToken = function() {
  return {
    system: "subscriber/controller",
    type: "missingResetToken"
  };
};

exports.badVerificationToken = function() {
  return {
    system: "subscriber/controller",
    type: "badVerificationToken"
  };
};

exports.missingVerificationToken = function() {
  return {
		system: "subscriber/controller",
		type: "missingVerificationToken"
	};
};

exports.badResetToken = function() {
  return {
    system: "subscriber/controller",
    type: "badResetToken"
  };
};

exports.missingAccessToken = function() {
  return {
    system: "subscriber/controller",
    type: "missingAccessToken"
  };
};

exports.badAccessToken = function() {
  return {
    system: "subscriber/controller",
    type: "badAccessToken"
  };
};

exports.accessTokenExpired = function() {
  return {
    system: "subscriber/controller",
    type: "accessTokenExpired"
  };
};

exports.subscriberNotActive = function() {
  return {
    system: "subscriber/model",
    type: "subscriberNotActive"
  };
};

exports.subscriberNotReset = function() {
  return {
    system: "subscriber/model",
    type: "subscriberNotReset"
  };
};

exports.subscriberClosed = function() {
  return {
    system: "subscriber/model",
    type: "subscriberClosed"
  };
};

// replace with subscriberNotActive?
exports.unverifiedSubscriber = function() {
  return {
    system: "subscriber/model",
    type: "unverifiedSubscriber"
  };
};

exports.subscriberAlreadyVerified = function() {
  return {
    system: "subscriber/controller",
    type: "subscriberAlreadyVerified"
  };
};

exports.badConfig = function() {
  return {
    system: "subscriber/adapter",
    type: "badEmailConfiguration"
  };
};

exports.sessionNotFound = function() {
  return {
    system: "subscriber/adapter",
    type: "sessionNotFound"
  };
};

})();

