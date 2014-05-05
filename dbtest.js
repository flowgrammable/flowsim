
var orm = require('orm');

// Database connection options
var options = {
  database : 'flowsim',
  protocol : 'pg',
  host : 'localhost',
  user : 'jasson',
};

orm.connect(options, function(err, db) {
  if (err) throw err;

  var Subscriber = db.define('subscriber', {
    email : String,
    password : String,
  });

  Subscriber.find({}, function(err, subs) {
    if(err) throw err;
    for(var sub in subs) {
      console.log('username:%s, password:%s', sub.email, sub.password);
    }
  });

  console.log('db connected');
});

