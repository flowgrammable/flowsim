
(function(){

exports.success = function() {
  return '';
};

exports.missingEmail = function() {
  return {
    system: 'subscriber/view',
    type: 'missingEmail'
  };
};

exports.malformedEmail = function() {
  return {
    system: 'subscriber/view',
    type: 'malformedEmail'
  };
};

exports.existingEmail = function() {
  return {
    system: 'subscriber/storage',
    type: 'existingEmail'
  };
};

exports.unknownEmail = function() {
  return {
    system: 'subscriber/storage',
    type: 'unknownEmail'
  };
};

exports.missingPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'missingPassword'
  };
};

exports.malformedPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'malformedPassword'
  };
};

exports.invalidPassword = function() {
  return {
    system: 'subscriber/controller',
    type: 'invalidPassword'
  };
};

exports.missingNewPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'missingNewPassword'
  };
};

exports.malformedNewPassword = function() {
  return {
    system: 'subscriber/view',
    type: 'malformedNewPassword'
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

