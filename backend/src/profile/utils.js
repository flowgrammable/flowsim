(function(){

var assert = require('assert');
var msg = require('./msg');
var _   = require('underscore');
var inspector = require('schema-inspector');
var openflow = require('./openflow');
var async = require('async');

function validateProfile(reqBody, cb){
  var profile = {};
  var errMsg;
  inspector.validate(openflow.profileSchema, reqBody, function(err, result){
    if(err){
      cb(err);
    } else {
      if(result.error){
        var fieldError;
        var fieldErrors = [];
        async.eachSeries(result.error, function(error, callback){
          fieldError = createFieldError(error);
          fieldErrors.push(fieldError);
          callback();
        }, function(err){
            if(err){
              cb(err);
            } else {
              cb(msg.profileErrors(fieldErrors));
            }
        });
      } else {
        cb(null, result);
      }
    }
  });
}

exports.validateProfile = validateProfile;

function createFieldError(error){
  return {
    name: error.property.substring(2),
    type: error.message ? error.message : 'missingField'
  };
}


})();
