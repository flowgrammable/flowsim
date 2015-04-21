
(function(){

exports.success = function() {
  return '';
};

exports.alreadyInOrganization = function() {
  return {
    message: 'You have already joined an organization',
    detail: {
      system: 'subscriber/view',
      type: 'organization'
    }
  };
};

exports.missingOrganizationName = function() {
  return {
    message: 'You must provide an organization name',
    detail: {
      system: 'subscriber/view',
      type: 'missingOrganizationName'
    }
  };
};

exports.missingEmail = function() {
  return {
    message: 'Email address is required',
    detail: {
      system: 'subscriber/view',
      type: 'missingEmail'
    }
  };
};

exports.malformedEmail = function() {
  return {
    message: 'Email entered is not valid',
    detail: {
      system: 'subscriber/view',
      type: 'malformedEmail'
    }
  };
};

exports.subscriberNotVerified = function(email) {
  return {
    message: 'This email address has not been verified',
    detail: {
      system: 'subscriber/controller',
      type: 'subscriberNotVerified',
      email: email
    }
  };
};

exports.unknownSubscriber = function() {
  return {
    message: 'Subscriber does not exist',
    detail: {
      system: 'subscriber/storage',
      type: 'unknownSubscriber'
    }
  };
};

exports.subscriberReset = function(email){
  return {
    message: 'This account password has been reset, check your email',
    detail: {
      system: 'subscriber/storage',
      type: 'subscriberReset'
    }
  };
};

exports.existingEmail = function() {
  return {
    message: 'A user with this email already exists',
    detail: {
      system: 'subscriber/storage',
      type: 'existingEmail'
    }
  };
};

exports.unknownEmail = function() {
  return {
    message: 'A user has not registered with that email',
    detail: {
      system: 'subscriber/storage',
      type: 'unknownEmail'
    }
  };
};

exports.missingPassword = function() {
  return {
    message: 'A password is required',
    detail: {
      system: 'subscriber/view',
      type: 'missingPassword'
    }
  };
};

exports.malformedPassword = function() {
  return {
    message: 'A valid password is 8-16 characters',
    detail: {
      system: 'subscriber/view',
      type: 'malformedPassword'
    }
  };
};

exports.invalidPassword = function() {
  return {
    message: 'Invalid Password',
    detail: {
      system: 'subscriber/controller',
      type: 'invalidPassword'
    }
  };
};

exports.missingNewPassword = function() {
  return {
    message: 'Missing new password',
    detail: {
      system: 'subscriber/view',
      type: 'missingNewPassword'
    }
  };
};

exports.malformedNewPassword = function() {
  return {
    message: 'A valid password is 8-16 characters',
    detail: {
      system: 'subscriber/view',
      type: 'malformedNewPassword'
    }
  };
};

exports.noDatabaseConnection = function() {
  return {
    message: 'Database failed',
    detail: {
      system: 'subscriber/storage',
      type: 'noDatabaseConnection'
    }
  };
};

exports.unknownError = function(err) {
  return {
    message: 'An unknown error occured',
    detail: {
      system: '*/*',
      type: 'unknownError',
      err: err
    }
  };
};

exports.unknownSessionToken = function() {
  return {
    message: 'Session token has expired',
    detail: {
      system: 'subscriber/storage',
      type: 'unknownSessionToken'
    }
  };
};

exports.missingToken = function() {
  return {
    message: 'User is not authenticated',
    detail: {
      system: 'subscriber/view',
      type: 'missingToken'
    }
  };
};

exports.unknownVerificationToken = function() {
  return {
    message: 'Token does not exist',
    detail: {
      system: 'subscriber/storage',
      type: 'unknownVerificationToken'
    }
  };
};

})();
