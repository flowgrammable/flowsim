
(function(){

exports.success = function() {
  return '';
};

//Packet Structure msgs

exports.missingPacketName = function() {
  return {
    message: 'Packet name is required',
    detail: {
      system: 'packet/view',
      type: 'missingName'
    }
  };
};

exports.invalidPacketName = function() {
  return {
    message: 'Packet name is not valid',
    detail: {
      system: 'packet/view',
      type: 'invalidPacketName'
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

exports.missingBytes = function() {
  return {
    message: 'Missing bytes field',
    detail: {
      system: 'packet/view',
      type: 'missingBytes'
    }
  };
};

exports.invalidBytes = function() {
  return {
    message: 'Bytes must be a integer',
    detail: {
      system: 'packet/view',
      type: 'invalidBytes'
    }
  };
};

exports.missingProtocols = function() {
  return {
    message: 'Missing protocols array',
    detail: {
      system: 'packet/view',
      type: 'missingProtocols'
    }
  };
};

exports.missingProtocol = function() {
  return {
    message: 'Missing protocol',
    detail: {
      system: 'packet/view',
      type: 'missingProtocol'
    }
  };
};

exports.missingProtocolName = function() {
  return {
    message: 'Missing protocol name',
    detail: {
      system: 'packet/view',
      type: 'missingProtocolName'
    }
  };
};

exports.invalidProtocolName = function() {
  return {
    message: 'Protocol Name must be string',
    detail: {
      system: 'packet/view',
      type: 'invalidProtocolName'
    }
  };
};

exports.missingProtocolBytes = function(proto) {
  return {
    message: 'Missing protocol bytes for ' + proto,
    detail: {
      system: 'packet/view',
      type: 'missingProtocolBytes'
    }
  };
};

exports.invalidProtocolBytes = function(proto) {
  return {
    message: 'Invalid protocol bytes for ' + proto,
    detail: {
      system: 'packet/view',
      type: 'invalidProtocolBytes'
    }
  };
};

exports.missingProtocolsFields = function(proto) {
  return {
    message: 'Missing Protocol Fields for ' + proto,
    detail: {
      system: 'packet/view',
      type: 'missingProtocolFields'
    }
  };
};

exports.invalidFieldType = function(proto, field) {
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

exports.missingField = function(proto, field){
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
      type: 'missingFields'
    }
  };
};

exports.invalidProtocolFields = function(msg){
  return {
    message: 'Protocol Fields must be a list',
    detail: {
      system: 'packet/view',
      type: 'invalidProtocolFields'
    }
  };
};

})();
