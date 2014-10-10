/*
* internal error
* invalid packet name
* packet already exists
* invalid bytes
* protocol does not exist
* bad protocol sequence
* field does not exist
* bad valud
*/


(function(){

exports.success = function() {
  return '';
};

exports.invalidPacketName = function() {
  return {
    message: 'Packet name is not valid',
    detail: {
      system: 'packet/view',
      type: 'invalidPacketName'
    }
  }
}

exports.missingPacketName = function() {
  return {
    message: 'Packet name is required',
    detail: {
      system: 'packet/view',
      type: 'missingName'
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
    message: 'Bytes must be a number',
    detail: {
      system: 'packet/view',
      type: 'missingBytes'
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
  }
}

exports.missingProtocol = function() {
  return {
    message: 'Missing protocol',
    detail: {
      system: 'packet/view',
      type: 'missingProtocol'
    }
  }
}

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
    message: 'Invalid Protocol Name',
    detail: {
      system: 'packet/view',
      type: 'invalidProtocolName'
    }
  };
};

exports.missingProtocolBytes = function() {
  return {
    message: 'Missing protocol bytes',
    detail: {
      system: 'packet/view',
      type: 'missingProtocolBytes'
    }
  }
}

exports.invalidProtocolBytes = function() {
  return {
    message: 'Invalid protocol bytes',
    detail: {
      system: 'packet/view',
      type: 'invalidProtocolBytes'
    }
  };
};

exports.missingProtocolFields = function() {
  return {
    message: 'Missing Protocol Fields',
    detail: {
      system: 'packet/view',
      type: 'missingProtocolFields'
    }
  }
}

exports.invalidFieldType = function() {
  return {
    message: 'Field must be string',
    detail: {
      system: 'packet/view',
      type: 'invalidFieldType'
    }
  }
}

})();
