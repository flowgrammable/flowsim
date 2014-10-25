
(function(){

exports.success = function() {
  return '';
};

//Profile Structure msgs

exports.profileDoesNotExist = function(name) {
  return {
    message: 'A profile with the name: ' + name + ' does not exist',
    detail: {
      system: 'profile/storage',
      type: 'profileDoesNotExist'
    }
  };
};

exports.missingField = function(name){
  return {
    message: 'Profile is missing '+name+' field',
    detail: {
      system: 'profile/view',
      type: 'missingField'
    }
  };
};

exports.profileErrors = function(fieldErrors){
  return {
    message: 'Profile is invalid',
    detail: {
      system: 'profile/view',
      type: 'invalidProfile',
      fields: fieldErrors
    }
  };
};

exports.invalidFieldType = function(fieldName, type){
  return {
    message: fieldName + ' must be of type ' + type,
    detail: {
      system: 'profile/view',
      type: 'invalidFieldType'
    }
  };
};

exports.badValue = function(msg){
  return {
    message: msg,
    detail: {
      system: 'profile/view',
      type: 'badValue'
    }
  };
};

})();
