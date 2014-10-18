var pg = require('../database/pg');
var logger = require('../logger/loggerStub');
var log = new logger.Logger();

var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}}, log);

function clearTables(tables, cb){
  for(var x in tables){
    db.delete(tables[x], {}, function(err, result){
      if(err){
        console.log('delete all ' + tables[x] +' error', err);
      }
    });
  }
  db.close();
  cb(null, 'done');
}


exports.clearTables = clearTables;
