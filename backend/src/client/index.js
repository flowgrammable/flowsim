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
  .option('--packet <token>', 'add packet')
  .option('--listpacket <token>', 'list packets')
  .option('--getpacket <token>', 'get packet detail')
  .option('--name <name>', 'packet name')
  .option('--updatepacket <token>', 'update packet detail')
  .parse(process.argv);

function query(name, type, headers, body, callback) {
  request({
    uri: 'https://127.0.0.1:8081/api/' + name,
    method: type,
    headers: headers,
    rejectUnauthorized : false,
    json: body
  }, callback);
}

function register(email, password) {
  query('subscriber/register', 'POST', {}, {
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
  query('subscriber/verify', 'POST', {}, {
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
  query('subscriber/forgot', 'POST', {}, {
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
  query('subscriber/reset', 'POST', {}, {
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
  query('subscriber/login', 'POST', {}, {
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
  query('subscriber/logout', 'POST', {
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
  query('subscriber/update', 'POST', {
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

function makeName()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
   text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function createPacket(token){
  var name = makeName();
  query('packet/'+name, 'POST', {
    'x-access-token': token
  }, {
    name: name,
    bytes: 20,
    protocols:[{
      name: 'Ethernet',
      bytes: 14,
      fields: [{
        Src: 'aa:aa:aa:aa:aa:aa'
      },{
        Dst: 'bb:bb:bb:bb:bb:bb'
      },{
        Typelen: '0x8100'
      }]
    }]
  }, function(err, res, body){
    if(err){
      console.log(err);
    } else {
      console.log(body);
    }
  })
}


function listPacket(token){
  query('packet', 'GET', {
    'x-access-token': token
  }, {}, function(err, res, body){
    if(err){
      console.log(err);
    } else {
      console.log(body);
    }
  })
}

function getPacket(token, pktname){
  query('packet/'+pktname, 'GET', {
    'x-access-token': token
  }, {}, function(err, res, body){
    if(err){
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

function updatePacket(token, pktname){
  var name = makeName();
  query('packet/'+pktname, 'PUT', {
    'x-access-token': token
  }, {

    name: name,
    bytes: 20,
    protocols:[{
      name: 'Ethernet',
      bytes: 14,
      fields: [{
        Src: 'aa:aa:aa:aa:aa:aa'
      },{
        Dst: 'bb:bb:bb:bb:bb:bb'
      },{
        Typelen: '0x8100'
      }]
    }]
  }, function(err, res, body){
    if(err){
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
} else if(cmd.packet){
  createPacket(cmd.packet);
} else if(cmd.listpacket){
  listPacket(cmd.listpacket);
} else if(cmd.getpacket && cmd.name){
  getPacket(cmd.getpacket, cmd.name);
} else if(cmd.updatepacket && cmd.name){
  updatePacket(cmd.updatepacket, cmd.name);
} else {
  console.log('Unknown arguments');
}

})();
