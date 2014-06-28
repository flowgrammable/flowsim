
msg = require('../msg');

exports.unwrap = function(result, succ, err) {
  if(result.success) {
    return succ(result.success.result);
  } else if(result.error) {
    if(typeof(err) != 'undefined')) {
      return err(result.error);
    } else {
      return result;
    }
  } else {
    throw "Undefined success and error objects";
  }
}

exports.success = function(data) {
  return msg.success({
    result: data
  });
}

exports.emailInUse = function() {
  return msg.error({
    system: "subscriber/model",
    type: "emailInUse"
  });
}

exports.missingEmail = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingEmail"
  });
}

exports.badEmail = function(em) {
  return msg.error({
    system: "subscriber/controller",
    type: "badEmail",
    email: em
  });
}

exports.missingPwd = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingPwd"
  });
}

exports.badPwd = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "badPwd"
  });
}

exports.missingToken = function() {
  return msg.error({
    system: "subscriber/controller",
    type: "missingVerificationToken"
  });
}


/*
exports.goodLogin = function(accessToken) {
  return msg.success({}, {
    'X-Access-Token': accessToken
  });
}
*/
