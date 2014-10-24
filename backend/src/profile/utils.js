(function(){

var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');
var async = require('async');
var of10 = require('./openflow_10');


function validateField(fieldName, type, reqBody, prof, cb){
  if(!_.has(reqBody, fieldName)){
    cb(msg.missingField(fieldName));
  } else if(typeof reqBody[fieldName] !== type){
    cb(msg.invalidFieldType(fieldName, type));
  } else {
    prof[fieldName] = reqBody[fieldName];
    cb();
  }
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
/**  n_tables   : 'number',
  n_ports     : 'number',
  mfr_desciption : 'string',
  hw_description : 'string',
  sw_description : 'string',
  serial_num     : 'string',
  dp_description : 'string',
  frag_handling  : 'string',
  ip_reassembly : 'boolean',
  port_blocked  : 'boolean' */
  ports : 'object'
  };

function validateProfile(reqBody, cb){
  var profile = {};
  var errMsg;
  // first validate fields applicable to all versions
  async.eachSeries(Object.keys(dpFields), function(field, callback){
    validateField(field, dpFields[field], reqBody, profile, callback);
  }, function(err){
    if(err){
      cb(err);
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
  });
}

exports.validateProfile = validateProfile;

})();
