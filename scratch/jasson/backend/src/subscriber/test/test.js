

var pg = require('../../database/pg');
var st = require('./../storage');

var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}});

var store = new st.Storage(db);

// Date must be passed in as ISO-8601 string
var d = new Date();
var dISO = d.toISOString();

store.createSubscriber('j@j', '123', dISO, '1.1.1.1', '090909', 
  function(err, result) {
    if(err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

store.getSubscriberByToken('1234321', function(err, result) {
  if(err) {
    console.log(err);
  } else {
    console.log(result);
  }
});

store.verifySubscriber('1234321', function(err, result) {
  if(err) {
    console.log(err);
  } else {
    console.log(result);
  }
});

db.close();
