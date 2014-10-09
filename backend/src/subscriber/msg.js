
(function(){

exports.success = function() {
  return '';
};

exports.missingEmail = function() {
  return {
    system: 'subscriber/view',
    type: 'missingEmail',
    message: 'Email address is required'
  };
};

exports.malformedEmail = function() {
  return {
    system: 'subscriber/view',
    type: 'malformedEmail',
    message: 'Email entered is not valid'
  };
};

exports.existingEmail = function() {
  return {
    system: 'subscriber/storage',
    type: 'existingEmail',
    message: 'A user with this email already exists'
  };
};

exports.unknownEmail = function() {
  return {
    system: 'subscriber/storage',
    type: 'unknownEmail',
    message: 'A user has not registered with that email'
  };
};

exports.missingPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'missingPassword',
    message: 'A password is required'
  };
};

exports.malformedPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'malformedPassword',
    message: 'A valid password is 8-16 characters'
  };
};

exports.invalidPassword = function() {
  return {
    system: 'subscriber/controller',
    type: 'invalidPassword'
    message: 'Invalid Password'
  };
};

exports.missingNewPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'missingNewPassword'
    message: 'Must enter a new password'
  };
};

exports.malformedNewPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'malformedNewPassword',
    message: 'A valid password is 8-16 characters'
  };
};

exports.noDatabaseConnection = function() {
  return {
    system: 'subscriber/storage',
    type: 'noDatabaseConnection'
  };
};

exports.unknownError = function(err) {
  return {
    system: '*/*',
    type: 'unknownError',
    err: err
  };
};

exports.unknownSessionToken = function() {
  return {
    system: 'subscriber/storage',
    type: 'unknownSessionToken'
  };
};

exports.missingToken = function() {
  return {
    system: 'subscriber/view',
    type: 'missingToken'
  };
};

exports.unknownVerificationToken = function() {
  return {
    system: 'subscriber/storage',
    type: 'unknownVerificationToken'
  };
};

})();
