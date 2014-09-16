
var sequelize = require('sequelize');
var async = require('async');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = function(cfg) {
  var name = 'database';
  var config = cfg.get(name) || {};

  var models = {};

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

  function _loadModels(dir) {
    _.each(fs.readdirSync(dir), function(file) {
      if(path.extname(file) == '.js') {
        var model = require(dir + '/' + file);
        // I'm not really sure we need to cache the models ..
        models[model.name] = {
          table: db.define(model.name, model.table, model.options),
          relation: model.relations
        };
        _.each(model.relation, function(value, key) {
          models[model.name].table[key](value.relative, value.options);
        });
      }
    });
  }

  return {
    loadModels: _loadModels
  };
};

