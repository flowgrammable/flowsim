
module.exports = function(db) {

  db.define('subscriber', {
    id : { type: 'integer', unique: true, defaultValue: undefined },
    email : { type: 'text', size: 128, unique: true },
    password :  { type: 'text', size: 60 },
    reg_date : { type: 'date', time: true },
    reg_ip : { type: 'text', size: 128 },
    status : { 
      type: 'enum', 
      values : [ 'REGISTERED', 'VERIFIED'], 
      defaultValue: 'REGISTERED' 
    },
    status_date : { type: 'date', time: true },
    reg_key : { type: 'text', size: 64 }
  });

}

