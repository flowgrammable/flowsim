
(function(){

exports.success = function() {
  return '';
};

//Switch Structure msgs

exports.switchDoesNotExist = function(name) {
  return {
    message: 'A switch with the name: ' + name + ' does not exist',
    detail: {
      system: 'switch/storage',
      type: 'switchDoesNotExist'
    }
  };
};

exports.missingField = function(name){
  return {
    message: 'Switch is missing '+name+' field',
    detail: {
      system: 'switch/view',
      type: 'missingField'
    }
  };
};

exports.switchErrors = function(fieldErrors){
  return {
    message: 'Switch is invalid',
    detail: {
      system: 'switch/view',
      type: 'invalidSwitch',
      fields: fieldErrors
    }
  };
};

exports.invalidFieldType = function(fieldName, type){
  return {
    message: fieldName + ' must be of type ' + type,
    detail: {
      system: 'switch/view',
      type: 'invalidFieldType'
    }
  };
};

exports.badValue = function(msg){
  return {
    message: msg,
    detail: {
      system: 'switch/view',
      type: 'badValue'
    }
  };
};

})();
