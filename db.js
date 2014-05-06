
var orm = require('orm');

var settings = {
  host : 'localhost',
  database : 'flowsim',
  user : 'jasson',
  protocol : 'pg'
};

function setup(db) {
  var models = {};

  models.subscriber = db.define('subscriber', {
    id : { type: 'integer', unique: true, defaultValue: undefined },
    email : { type: 'text', size: 128, unique: true },
    password :  { type: 'text', size: 32 },
    reg_date : { type: 'date', time: true },
    reg_ip : { type: 'text', size: 64 },
    status : { 
      type: 'enum', 
      values : [ 'REGISTERED', 'VERIFIED' ], 
      defaultValue: 'REGISTERED' 
    },
    status_date : { type: 'date', time: true },
    reg_key : { type: 'text', size: 64 }
  });

  models.session = db.define('session', {
    id : { type: 'integer', unique: true, defaultValue: undefined },
    sub_id : { type: 'integer' },
    key: {type: 'text', size: 64 },
    begin_time: { type: 'date', time: true },
    end_time: { type: 'date', time: true },
    ip: { type: 'text', size: 64 },
    status: {
      type: 'enum',
      values: [ 'ACTIVE', 'TIMEDOUT', 'LOGGEDOUT' ],
      defaultValue: 'ACTIVE'
    }
  });

  return models;
}

orm.connect(settings, function(err, db) {
  if(err) throw err;
  console.log('connected to db');
  var models = setup(db);


  var Jasson = {
    email: 'jasson@flowgrammable.com',
    password: 'jasson123',
    reg_date: new Date(),
    reg_ip: '1.2.3.4',
    status_date: new Date(),
    reg_key: '1234'
  };

  models.subscriber.create(Jasson, function(err, results) {
    if(err) throw err;
    console.log('success\n' + results);
  });

});
