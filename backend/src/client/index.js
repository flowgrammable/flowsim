#!/usr/bin/env node

(function(){

var cmd     = require('commander');
var request = require('request');
var fs      = require('fs');

// this is a hack ... find better way
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

cmd
  .option('--register <email>', 'Register an account')
  .option('--verify <token>', 'Verify an account')
  .option('--forgot <email>', 'Reset the pwd of an account')
  .option('--reset <token>', 'Update forgotten password')
  .option('--login <email> ', 'login to an account')
  .option('--logout <token>', 'logout of an account')
  .option('--update <email>', 'Change the pwd of an account')
  .option('--password <password>', 'password for account')
  .option('--newPassword <newPassword>', 'password for account')
  .option('--token <token>', 'x-access-token')
  .parse(process.argv);

function query(name, headers, body, callback) {
  request({
    uri: 'https://127.0.0.1:8081/api/subscriber/' + name,
    method: 'POST',
    headers: headers,
    rejectUnauthorized : false,
    json: body
  }, callback);
}

function register(email, password) {
  query('register', {}, {
    email: email,
    password: password
  }, function(err, res, body) {
    if(err) {
      console.log('client cant connect to back');
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function verify(token) {
  query('verify', {}, {
    token: token
  }, function(err, res, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function forgot(email) {
  query('forgot', {}, {
    email: email
  }, function(err, res, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function reset(token, password) {
  query('reset', {}, {
    token: token,
    password: password
  }, function(err, res, body){
    if(err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function login(email, password) {
  query('login', {}, {
    email: email,
    password: password
  }, function(err, res, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function logout(token) {
  query('logout', {
    'x-access-token': token
  }, {}, function(err, res, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function update(email, token, password, newPassword) {
  query('update', {
      'x-access-token': token
  }, {
    email: email,
    oldPassword: password,
    newPassword: newPassword
  }, function(err, res, body) {
    if(err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

if(cmd.register && cmd.password) {
  register(cmd.register, cmd.password);
} else if(cmd.verify) {
  verify(cmd.verify);
} else if(cmd.forgot) {
  forgot(cmd.forgot);
} else if(cmd.reset && cmd.password) {
  reset(cmd.reset, cmd.password);
} else if(cmd.login && cmd.password) {
  login(cmd.login, cmd.password);
} else if(cmd.logout) {
  logout(cmd.logout);
} else if(cmd.update && cmd.token && cmd.password && cmd.newPassword) {
  update(cmd.update, cmd.token, cmd.password, cmd.newPassword);
} else {
  console.log('Unknown arguments');
}

})();

