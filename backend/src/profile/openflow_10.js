(function(){

var assert = require('assert');
var msg = require('./msg');
var async  = require('async');
var _ = require('underscore');
var profUtils = require('./utils');


/**
 * Port fields used in openflow 1.0
 **/
var portFields = {
  id : 'number',
  hw_addr : 'string',
  name : 'string'
};

/**
 * Ports fields used in openflow 1.0
 **/
var portsFields = {
  vp_normal : 'bool',
  vp_flood  : 'bool'
};

function validatePort(bodyPort, profile, cb){
  var port = {};
  async.eachSeries(Object.keys(portFields), function(field, callback){
    profUtils.validateField(field, portFields[field],
        bodyPort, port, callback);
  }, function(err){
    if(err){
      cb(err);
    } else {
      profile.ports.push(port);
      cb();
    }
  });
}

function validatePorts(body, profile, cb){
  async.eachSeries(body.ports, function(bodyPort, callback){
    validatePort(bodyPort, profile, callback);
  }, cb);
}

function validate(reqBody, profile, cb){
  var errMsg;
  // validate 1.0 Ports
  profile.ports = [];
  async.waterfall([
    function(callback){
      validatePorts(reqBody, profile, callback);
    },
    function(callback){
      console.log('hit next func');
    }
    ], function(err, result){
        if(err){
          cb(err)
        } else {
          console.log('result', result);
        }
    });
}

exports.validate = validate;

})();
