
/**
 * @module database
 */

(/** @lends module:database */function(){

var pg = require('pg');
var _  = require('underscore');

var name    = 'database';
var defHost = '127.0.0.1';

/**
 * Wraps a pg database object.
 *
 * @constructor
 * @param {Object} config          - a database pg configuration object
 * @param {String} config.host     - the hostname of the database server
 * @param {String} config.database - the name of the database
 * @param {String} config.user     - the username to use for the connection
 * @param {String} config.pwd      - the password to use for the connection
 */
function Database(config) {
  this.config = config[name];
  this.config.host = this.config.host || defHost;

  // set the postgres connection string
  this.setup = 'postgres://' + this.config.user + ':' + this.config.pwd + 
               '@' + this.config.host + '/' + this.config.database;

}
exports.Database = Database;

/**
 * Close all connections in the pg connection pool.
 *
 */
Database.prototype.close = function() {
  pg.end();
}

/**
 * Take a parameterized SQL query and arguments, execute the rendered
 * statement against the postgres connection and call the callback with the
 * appropriate arguments.
 *
 * @param {String} qString - parametric SQL query string
 * @param {[String]} args - array of arguments to render in parametric SQL query
 * @param {genericCallback} callback - a generic callback for query results
 */
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
        // release the connection back to the pool
        done();
      });
    } 
  });
};

/**
 * Take an SQL query, execute the statement against the postgres connection and
 * call the callback with the appropriate arguments.
 *
 * @param {String} qString - SQL query string
 * @param {genericCallback} callback - a generic callback for query results
 */
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
        // release the connection back to the pool
        done();
      });
    } 
  });
};

/**
 * Form a valid SQL assignment clause given a set of field/value pairs. This can
 * be used to construct WHERE clauses as well as for UPDATE statements.
 *
 * @param {Object} conjunction - field/value pairs to build an assignment
 */
function mkAssignment(fvPairs) {
  var _result = '';
  if(Object.keys(fvPairs).length > 0) {
    _result = _.map(fvPairs, function(value, key) {
      var _value = typeof value === 'number' ? value : '\'' + value + '\'';
      return key + '=' value;
    }).join(', ');
  }
  return _result;
}

/**
 * Form a valid SQL WHERE clause given a set of field/value pairs. Assumes
 * equality comparison.
 *
 * @param {Object} conjunction - field/value pairs to build a conjunction
 */
function mkWhere(conjunction) {
  var _where = '';
  if(Object.keys(conjunction).length > 0) {
    _result = _.map(conjunction, function(value, key) {
      var _value = typeof value === 'number' ? value : '\'' + value + '\'';
      return key + '=' value;
    }).join(' AND ');
    _where = 'WHERE (' + _where + ')';
  }
  return _where;
}

/**
 * Constructs a valid SQL FIELDS clause given a set of field names.
 *
 * @param {[String]} fields - a list of field names
 */
function mkFields(fields) {
  return '(' + fields.join(', ') + ')';
}

/**
 * Constructs a valid SQL VALUES clause given a set of values.
 *
 * @param {[String|Number]} values - an array of values
 */
function mkValues(values) {
  var _values;
  if(values.length === 0) {
    throw 'mkValues: ' + values;
  }
  _values = _.map(values, function(value) {
    return typeof value === 'number' ? value : '\'' + value + '\'';
  }).join(' ,');
  return 'VALUES (' + _values + ')';
}

/**
 * Given a table name and an object with field/value pairs, construct a valid
 * SQL statement.
 *
 * @param {String} table - the target table for insertion
 * @param {Object} fvPairs - set of field/value pairs that to be inserted
 */
function mkInsert(table, fvPairs) {
  var _head, _fields, _values;
  _head = 'INSERT INTO ' + table + ' ';
  _fields = [];
  _values = [];
  _.each(fvPairs, function(value, key) {
    _fields.push(key);
    _values.push(value);
  });
  return _head + ' ' + mkFields(_fields) + ' ' + mkValues(_values);
}

/**
 * Inserts a new object into a specified table using the object's keys as SQL 
 * fields and the corresponding values as SQL VALUES.
 *
 * @param {String} table      - the target table for insertion
 * @param {Object} fvPairs    - a set of field/value pairs for insertion
 * @param {CallBack} callback - callback function to use
 */
Databaset.prototype.insert = function(table, fvPairs, callback) {
  this.queryStmt(mkInsert(table, fvPairs), callback);
};

/**
 * Creates a valid SQL select statement given a table, fields to select, 
 * and a conjunction of field/values to screen against.
 *
 * @param {String} table    - the target table for insertion
 * @param {[String]} fields - a list of fields to present in the results
 * @param {Object} conjunct - a conjunction of field/value pairs to filter 
 */
function mkSelect(table, fields, conjunct) {
  var _head, _where, _fields;
  _fields = fields.length > 0 ? fields.join(', ') : '*';
  _head = 'SELECT ' + _fields + ' ' + table;
  return _head + mkWhere(conjunct);
}

/**
 * Selects the specified field values from all rows in a table that match a user
 * provided field/value conjunction.
 *
 * @param {String} table      - target table for selection
 * @param {Object} conjunct   - set of key/value pairs to filter matching rows
 * @param {CallBack} callback - callback function to use
 */
Database.prototype.select = function(table, fields, conjunct, callback) {
  this.queryStmt(mkSelect(table, fields, conjunct), callback);
};

/**
 * Create a valid SQL statement that udpates a set of specified fields with new
 * values in the specified table that match the supplied conjunction of 
 * filed/value pairs.
 *
 * @param {String} table    - target table for selection
 * @param {Object} fvPairs  - selects the target field and updates with value
 * @param {Object} conjunct - conjunction of field/value pairs to filter update
 */
function mkUpdate(table, fvPairs, conjunct) {
  return 'UPDATE ' + table + ' SET ' + mkAssignment(fvPairs) + mkWhere(conjunct);
}

/**
 * Updates a set of rows in a table that match a field/value conjunction
 * using a set of field/value pairs.
 *
 * @param {String} table      - the target table for update
 * @param {Object} fvpairs    - a set of field/value pairs to update
 * @param {Object} conjunct   - a set of field/value pairs to filter
 * @param {CallBack} callback - callback function to use
 */
Database.prototype.update = function(table, fvPairs, conjunct, callback) {
  this.queryStmt(mkUpdate(table, fvPairs, conjunct), callback);
};

})();

