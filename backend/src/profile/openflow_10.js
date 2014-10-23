(function(){

var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');
var profUtils = require('./utils');


/**
 * Datapath fields that are used in every version of
 * openflow
 **/
var portFields = {
  id : 'number',
  hw_addr : 'string',
  name : 'string'
}

function validatePort(port, ports){
  var errMsg;
  _.every(portFields, function(v, i){
    errMsg = utils.validateField(i, v, port);
    return !errMsg;
  });
  return errMsg;
}

function validate(profile, reqBody, cb){
  var errMsg;
  // validate 1.0 Ports
  profile.ports = [];
  _.every(reqBody.ports, function(v, i){
    errMsg = validatePort(v,profile.ports);
    return !errMsg;
  });

}

exports.validate = validate;

})();
