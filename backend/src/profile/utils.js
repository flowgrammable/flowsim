(function(){

var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');
var of10 = require('./openflow_10');


function validateField(fieldName, type, reqBody, cb){
  if(!_.has(reqBody, fieldName)){
    return msg.missingField(fieldName);
  } else if(typeof reqBody[fieldName] !== type){
    return msg.invalidFieldType(fieldName, type)
  }
  return false;
}
exports.validateField = validateField;


/**
 * Datapath fields that are used in every version of
 * openflow
 **/
var dpFields = {
  name        : 'string',
  ofp_version : 'number',
  datapath_id : 'number',
  n_buffers   : 'number',
  n_tables   : 'number',
  n_ports     : 'number',
  mfr_desciption : 'string',
  hw_description : 'string',
  sw_description : 'string',
  serial_num     : 'string',
  dp_description : 'string',
  frag_handling  : 'string',
  ip_reassembly : 'boolean',
  port_blocked  : 'boolean',
  };

function validateProfile(reqBody, cb){
  var profile = {};
  var errMsg;
  // first validate fields applicable to all versions
  _.every(dpFields, function(v, i){
    errMsg = validateField(i, v, reqBody);
    return !errMsg;
  });
  // then validate fields by version
  if(errMsg){
    cb(errMsg);
  } else {
    switch(profile.ofp_version){
      case 0:
        of10.validate(reqBody, profile, cb);
        break;
      default:
        cb(msg.badValue('ofp_version must be 0-4'));
        break;
    }
  }
}

exports.validateProfile = validateProfile;

})();
