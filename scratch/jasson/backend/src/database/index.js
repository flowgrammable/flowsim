
var sequelize = require('sequelize');

module.exports = function(cfg) {
  var config = cfg;
  var name = 'database';

  var db = new sequelize({
    database: config.db,
    user: config.user,
    pass: config.pwd
  })
    .authenticate()
    .complete(function(err) {
      if(err) {
      } else {
      }
    });

  return {
    addModel: function(model) {
      // do something
    }
  };
};

