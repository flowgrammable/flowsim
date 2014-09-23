
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

Database.prototype.queryArgs = function(qString, args, callback) {
  pg.connect(this.setup, function(err, client, done) {
    if(err) {
      callback(err);
    } else {
      client.query(qString, args, function(err, result) {
        if(err) {
          callback(err);
        } else {
          callback(null, result.rows);
        } 
        done();
      });
    } 
  });
};

Database.prototype.queryStmt = function(qString, callback) {
  pg.connect(this.setup, function(err, client, done) {
    if(err) {
      callback(err);
    } else {
      client.query(qString, function(err, result) {
        if(err) {
          callback(err);
        } else {
          callback(null, result.rows);
        } 
        done();
      });
    } 
  });
};

Database.prototype.close = function() {
  pg.end();
}

function mkStatement(head, table, fields) {
  var _head, _fields, _values;
  _head= head + table;
  _fields = fields.join(', ');
  _values = _.map(fields, function(value, key) {
    return '$' + (key + 1);
  }).join(', ');
  return _head + ' (' + _fields + ') ' + 'VALUES' + ' (' + _values + ')';
}

function mkInsert(table, fields) {
  return mkStatement('INSERT INTO ', table, fields);
}

function mkSelect(table, exprs) {
  var _head, _where;
  _head = 'SELECT * FROM ' + table + ' WHERE ';
  _where = _.map(exprs, function(value, key) {
    var _value = (typeof value === 'number') ? value : '\'' + value + '\'';
    return key + '=' + _value;
  }).join(' AND ');
  return _head + '(' + _where + ')';
}

function mkUpdate(table, fields, filters) {
  var _head, _fields, _filters;
  _head = 'UPDATE ' + table + ' SET ';
  _fields = _.map(fields, function(value, key) {
    return value + ' = ' + '$' + (key + 1);
  }).join(', ');
  _filters = ' WHERE ' + _.map(filters, function(value, key) {
    var _value = typeof value === 'number' ? value : '\'' + value + '\'';
    return key + ' = ' + _value;
  }).join(' AND ');
  return _head + _fields + _filters;
}

Database.prototype.insert = function(table, fields, values, callback) {
  this.queryArgs(mkInsert(table, fields), values, callback);
};

Database.prototype.search = function(table, exprs, callback) {
  this.queryStmt(mkSelect(table, exprs), callback);
};

Database.prototype.update = function(table, fields, filters, values, callback) {
  console.log(mkUpdate(table, fields, filters));
  this.queryArgs(mkUpdate(table, fields, filters), values, callback);
};

})();

