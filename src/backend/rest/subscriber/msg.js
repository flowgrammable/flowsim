
msg = require('../msg');

exports.good = function() {
  return msg.success({});
}

exports.goodLogin = function(accessToken) {
  return msg.success({}, {
    'X-Access-Token': accessToken
  });
}

exports.badUsername = function() {
  return msg.error({
    description: 'Bad email address'
  });
}

exports.badPassword = function() {
  return msg.error({
    description: 'Bad password'
  });
}

