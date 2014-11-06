
(function(){

exports.success = function() {
  return '';
};

//Trace Structure msgs

exports.traceDoesNotExist = function(name) {
  return {
    message: 'A trace with the name: ' + name + ' does not exist',
    detail: {
      system: 'trace/storage',
      type: 'traceDoesNotExist'
    }
  };
};

exports.existingTrace = function(name) {
  return {
    message: 'A trace with the name: ' + name + ' already exists',
    detail: {
      system: 'trace/storage',
      type: 'traceAlreadyExists'
    }
  };
};

exports.missingField = function(name){
  return {
    message: 'Trace is missing '+name+' field',
    detail: {
      system: 'trace/view',
      type: 'missingField'
    }
  };
};

exports.traceErrors = function(fieldErrors){
  return {
    message: 'Trace is invalid',
    detail: {
      system: 'trace/view',
      type: 'invalidTrace',
      fields: fieldErrors
    }
  };
};

exports.invalidFieldType = function(fieldName, type){
  return {
    message: fieldName + ' must be of type ' + type,
    detail: {
      system: 'trace/view',
      type: 'invalidFieldType'
    }
  };
};

exports.badValue = function(msg){
  return {
    message: msg,
    detail: {
      system: 'trace/view',
      type: 'badValue'
    }
  };
};

exports.unknownError = function(msg){
  return {
    message: 'An unknown error occured',
    detail: {
      system: 'trace/unknown',
      type: 'unknownError'
    }
  };
};

})();
