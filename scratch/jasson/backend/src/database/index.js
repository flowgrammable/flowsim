
/**
 * @module database
 */

(/** @lends module:database */function(){

var sequelize = require('sequelize');
var async     = require('async');
var fs        = require('fs');
var path      = require('path');
var _         = require('underscore');

var fmt = require('../utils/formatter');

var name = 'database';

var defHost = '127.0.0.1';

/**
 * Provides Database services.
 *
 * @constructor
 * @param {config} config - a global configuration object
 */

function Database(config) {
  this.config = config[name] || {};

  this.models = {};

  this.db = new sequelize(
    this.config.database,
    this.config.user,
    this.config.pwd,
    {
      host: this.config.host || defHost,
      dialect: this.config.dialect
      //port: this.config.port || 3306     <-- some sort of bug with this 
    });

  // do not return until this is done
  async.series(this.db.authenticate().complete, function(err, results) {
    if(err) throw err;
  });
}
exports.Database = Database;

Database.prototype.toFormatter = function(f) {
  f.begin('Database');
  f.addPair('Name', this.config.database);
  f.addPair('Dialect', this.config.dialect);
  f.addPair('User', this.config.user);
  f.end();
};

Database.prototype.toString = fmt.toString;

Database.prototype.table = function(tbl) {
  return this.models[tbl].table || null;
};

Database.prototype.loadModels = function(dir) {
  var that = this;
  _.each(fs.readdirSync(dir), function(file) {
    if(path.extname(file) == '.js') {
      var model = require(dir + '/' + file);
      // I'm not really sure we need to cache the models ..
      that.models[model.name] = {
        table: that.db.define(model.name, model.table, model.options),
        relation: model.relations
      };
      _.each(model.relation, function(value, key) {
        that.models[model.name].table[key](value.relative, value.options);
      });
    }
  });
};

Database.prototype.loadLocalModels = function(dir) {
  this.loadModels(dir + '/models/');
};

})();

