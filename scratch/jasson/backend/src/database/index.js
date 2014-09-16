
var sequelize = require('sequelize');
var async = require('async');

module.exports = function(cfg) {
  var name = 'database';
  var config = cfg.get(name) || {};

  var db = new sequelize(
    config.database,
    config.user,
    config.pwd,
    {
      host: config.host || '127.0.0.1',
      dialect: config.dialect
      //port: config.port || 3306     <-- some sort of bug with this 
    });

  // do not return until this is done
  async.series(db.authenticate().complete, function(err, results) {
    if(err) throw err;
  });

  return {
    addModel: function(model) {
      // do something useful
    }
  };
};

