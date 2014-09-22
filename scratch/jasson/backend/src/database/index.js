
/**
 * @module database
 * @requires module:utils~Formatter
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
 * A database connection wrapper using the Sequelize library.
 *
 * @constructor
 * @param {Object} config          - a database configuration object
 * @param {String} config.host     - the hostname of the database server
 * @param {String} config.database - the name of the database
 * @param {String} config.user     - the username to use for the connection
 * @param {String} config.pwd      - the password to use for the connection
 * @param {String} config.dialect  - the SQL database type
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

/**
 * Using a formatter nicely format the Database object.
 *
 * @param {module:utils~Formatter} f - a formatter instance
 * @returns {module:utils~Formatter} a formatter object
 */
Database.prototype.toFormatter = function(f) {
  f.begin('Database');
  f.addPair('Name', this.config.database);
  f.addPair('Dialect', this.config.dialect);
  f.addPair('User', this.config.user);
  f.end();
  return f;
};

Database.prototype.toString = fmt.toString;

/**
 * Obtain a reference to the Sequelize model corresponding to a particluar
 * table.
 *
 * @param {String} tbl - the name of the database table to retrieve
 * @returns {Object} a Sequelize model 
 */

Database.prototype.table = function(tbl) {
  return this.models[tbl].table || null;
};

/**
 * Load all Sequelize models, relations, and tables from a directory.
 *
 * @param {String} dir - a qualified directory path
 * @returns {undefined}
 */

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

/**
 * Look for Sequelize models/relations/options in the models/ subdirectory
 * located within the specified directory.
 *
 * @param {String} dir - a qualified directory path
 * @returns {undefined}
 */
Database.prototype.loadLocalModels = function(dir) {
  this.loadModels(dir + '/models/');
};

})();

