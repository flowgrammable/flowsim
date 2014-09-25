var uuid = require('uuid');

var pg = require('../../database/pg');
var st = require('./../storage');

var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}});

var store = new st.Storage(db);

var d = new Date();
var dISO = d.toISOString();

function genString(n){
  var y = '';
  for(i = 0; i < n; i++)
      y+= 'a';	
  return y;
};

// email longer than 128 chars
var badLength = genString(200);
store.createSubscriber(badLength, '123', dISO, '1.1.1.1', uuid.v4(), 
  function(err, result){
    if(err) {
      console.log('createSub error');
      console.log('Email length greater than 128');
      console.log(err);
    } else {
      console.log(result)
    }
});

// password longer than 60 chars
var badPass = genString(61);
store.createSubscriber('hi', badPass, dISO, '1.1.1.1', uuid.v4(),
  function(err, result){
  	if(err) {
			console.log('createSub error');
      console.log('Password length greater than 60');
			console.log(err);
		} else {
			console.log(result);
		}
});

// badpass and bad email length
store.createSubscriber(uuid.v4() , 'hi' , dISO, '11.1.1', uuid.v4(),
  function(err, result){
    if(err){
      console.log('createSub error');
      console.log('Incorrect IP address syntax: 11.1.1');
      console.log(err);
    } else {
      console.log(result);
    }
});

//bad Date format (javascript date)
store.createSubscriber(uuid.v4(), 'hi', new Date(), '1.1.1.1', uuid.v4(),
  function(err, result){
    if(err){
      console.log('createSub error');
      console.log('Invalid date format: javascript Date()');
      console.log(err);
    } else {
      console.log(result);
    }
});
db.close();
