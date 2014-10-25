
(function(){

exports.success = function() {
  return '';
};

//Packet Structure msgs

exports.packetDoesNotExist = function(name) {
  return {
    message: 'A packet with the name: ' + name + ' does not exist',
    detail: {
      system: 'packet/storage',
      type: 'packetDoesNotExist'
    }
  };
};

exports.missingField = function(field) {
  return {
    message: 'Missing ' + field + ' field',
    detail: {
      system: 'packet/view',
      type: 'missingField'
    }
  };
};

exports.invalidType = function(field, type) {
  return {
    message: field +' field requires type to be ' + type,
    detail: {
      system: 'packet/view',
      type: invalidType
    }
  };
};

exports.existingPacket = function() {
  return {
    message: 'A packet with this name already exists',
    detail: {
      system: 'packet/storage',
      type: 'existingPacket'
    }
  };
};

exports.invalidProtoFieldType = function(proto, field) {
  return {
    message: proto +' ' + field + ' field must be string',
    detail: {
      system: 'packet/view',
      type: 'invalidFieldType'
    }
  };
};

exports.badProtocolSequence = function(msg) {
  return {
    message: msg,
    detail: {
      system: 'packet/view',
      type: 'badProtocolSequence',
    }
  };
};

exports.unknownProtocol = function() {
  return {
    message: 'Unknown Protocol',
    detail: {
      system: 'packet/view',
      type: 'unknownProtocol'
    }
  };
};

exports.missingProtoField = function(proto, field){
  return {
    message: proto + ' is missing ' + field + 'field',
    detail: {
      system: 'packet/view',
      type: 'missingField'
    }
  };
};

exports.badValue = function(msg){
  return {
    message: msg,
    detail: {
      system: 'packet/view',
      type: 'badValue'
    }
  };
};

exports.missingProtocolNumber = function(protoName, fields){
  return {
    message: protoName + ' must have ' + fields + ' fields',
    detail: {
      system: 'packet/view',
      type: 'missingField'
    }
  };
};


})();
