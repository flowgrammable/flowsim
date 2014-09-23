

var pg = require('../database/pg');
var st = require('./storage');

var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}});

var store = new st.Storage(db);

store.createSubscriber('j@j', '123', new Date(), '1.1.1.1', '090909');
