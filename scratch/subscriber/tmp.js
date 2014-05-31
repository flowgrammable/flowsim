
var orm = require('orm');
var settings = require('config/settings');
var models = require('./models');
var logic = require('./logic');

orm.connect(settings.database, function(err, db) {
  if(err) throw err;
  console.log('connected to db');

  var subscribers = models.define(db);

  var sub = {
    email: 'jasson@flowgrammable.com',
    password: '123',
    ip: '1.2.3.4'
  };

  logic.register(sub, subscribers, function(err, results) {
    if(err) throw err;
    console.log('success\n' + results);
  });

  var ver = {
    email: 'jasson@flowgrammable.com',
    reg_key: registration_key
  };

  console.log('global: %s', registration_key);

  logic.verify(ver, subscribers, function(err, results) {
    if(err) throw err;
    for (var i=0; i< results.length; ++i) {
      console.log(results[i].email);
      console.log(results[i].reg_key);
    }
  });

});

