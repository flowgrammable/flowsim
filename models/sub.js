
exports.setup = function(db) {
  var models = {};

  var Subscriber = db.define('subscriber', {
    id : { type: 'integer', unique: true, defaultValue: undefined },
    email : { type: 'text', size: 128, unique: true },
    password :  { type: 'text', size: 60 },
    reg_date : { type: 'date', time: true },
    reg_ip : { type: 'text', size: 128 },
    status : { 
      type: 'enum', 
      values : [ 'REGISTERED', 'VERIFIED' ], 
      defaultValue: 'REGISTERED' 
    },
    status_date : { type: 'date', time: true },
    reg_key : { type: 'text', size: 64 }
  });
  models.subscriber = Subscriber;

  var Session = db.define('session', {
    id : { type: 'integer', unique: true, defaultValue: undefined },
    sub_id : { type: 'integer' },
    key: {type: 'text', size: 128 },
    begin_time: { type: 'date', time: true },
    end_time: { type: 'date', time: true },
    ip: { type: 'text', size: 64 },
    status: {
      type: 'enum',
      values: [ 'ACTIVE', 'TIMEDOUT', 'LOGGEDOUT' ],
      defaultValue: 'ACTIVE'
    }
  });
  Session.hasOne('subscriber', Subscriber);
  models.session = Session;

  return models;
}

