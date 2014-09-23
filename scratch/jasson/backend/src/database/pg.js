
/**
 * @module database
 */

(/** @lends module:database */function(){

var pg = require('pg');
var _  = require('underscore');

var name = 'database';
var defHost = '127.0.0.1';

/**
 * @constructor
 * @param {Object} config - a database pg configuration object
 */
function Database(config) {
  this.config = config[name];
  this.config.host = this.config.host || defHost;

  this.setup = 'postgres://' + this.config.user + ':' + this.config.pwd + 
               '@' + this.config.host + '/' + this.config.database;

}
exports.Database = Database;

Database.prototype.query = function(qString, args, callback) {
  pg.connect(this.setup, function(err, client, done) {
    if(err) {
      callback(err);
    } else {
      client.query(qString, args, function(err, result) {
        if(err) {
          callback(err);
        } else if(result) {
          callback(null, result.rows);
        } else {
          callback(err);
        }
        done();
      });
    }
  });
};

Database.prototype.close = function() {
  pg.end();
}

function mkInsert(table, fields) {
  var _head, _fields, _values;
  _head= 'INSERT INTO ' + table;
  _fields = fields.join(', ');
  _values = _.map(fields, function(value, key) {
    return '$' + (key + 1);
  }).join(', ');
  return _head + ' (' + _fields + ') ' + 'VALUES' + ' (' + _values + ')';
};

Database.prototype.insert = function(table, fields, values, callback) {
  console.log(mkInsert(table, fields));
  this.query(mkInsert(table, fields), values, callback);
};

})();

