
(function(){

var db  = require('../../database/pg');
var stg = require('../storage');

var database = new db.Database({
  database: {
    database: 'flowsim',
    user: 'flogdev',
    pass: 'flogdev',
    dialect: 'postgres'
  }
});
var storage = new stg.Storage(database);

function handler(err, result) {
    if(err) {
      console.log('insert sub err: ' + JSON.stringify(err));
    } else if(result) {
      console.log('insert sub succ: ' + JSON.stringify(result));
      console.log(typeof result);
    } else {
      console.log('insert sub no params');
    }
}

/*
storage.createSubscriber(
  'asson@flowgrammable.com',
  'passwordishard',
  new Date(),
  '10.0.0.1',
  'asdfasdf',
  handler
);

storage.createSubscriber(
  'jasson@flowgrammable.com',
  'passwordishard',
  new Date(),
  '10.0.0.1',
  'asdfasdf',
  handler
);
*/

storage.getSubscriberByToken('asdfasdf', function(err, succ) {
  if(err) {
    console.log('reached an error');
    console.log(err);
  } else if(succ) {
    console.log('found it');
    console.log(succ);
  } else {
    console.log('no results');
  }
});

storage.getSubscriberByToken('asasdf', function(err, succ) {
  if(err) {
    console.log('reached an error');
    console.log(err);
  } else if(succ) {
    console.log('found it');
    console.log(succ);
  } else {
    console.log('no results');
  }
});

storage.updateSubscriber({
  email: 'jasson@flowgrammable.com',
  password: 'passwordishard',
  date: new Date(),
  ip: '10.0.0.1',
  token: 'zzzzzzz',
}, function(err, succ) {
  console.log('update table');
  if(err) {
    console.log('err');
    console.log(err);
  } else if(succ) {
    console.log('succ');
    console.log(succ);
  } else {
    console.log('no results');
  }
});

})();

