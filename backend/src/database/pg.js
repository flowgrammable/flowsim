
/**
 * @module database
 */

(/** @lends module:database */function(){

var pg = require('pg');
var _  = require('underscore');


var name    = 'database';
var defHost = '127.0.0.1';

var Error = {
  DUPLICATE_KEY: '23505'
};

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
function Database(config, logger) {
  this.config = config[name];
  this.config.host = this.config.host || defHost;

  this.logger = logger;

  // set the postgres connection string
  this.setup = 'postgres://' + this.config.user + ':' + this.config.pwd + 
               '@' + this.config.host + '/' + this.config.database;

}
exports.Database = Database;

function dbError(method, err, meta){
  return {
    module: 'Database',
    method: method,
    pub: {},
    error: err,
    meta: meta || {}
  };
}

function localErrorHandler(method, err, meta){
  //Construct error object
  var e = dbError(method, err, meta); 
  switch(err.code){
    case '23505':
      // Handle Unique Key Violation
      e.pub = 'QueryFailure';
      break;
    case 'ECONNREFUSED':
      // Handle Connection Error
      // Maybe try to reconnect
      e.pub = 'ServerFailure';
      break;
    default:
      e.pub = 'Unknown';
      break;
  }
  return e; 

}
/**
 * Close all connections in the pg connection pool.
 *
 */
Database.prototype.close = function() {
  pg.end();
};

/**
 * Take a parameterized SQL query and arguments, execute the rendered
 * statement against the postgres connection and call the callback with the
 * appropriate arguments.
 *
 * @param {String} qString - parametric SQL query string
 * @param {Array(String)} args - array of arguments to render in parametric SQL query
 * @param {genericCallback} callback - a generic callback for query results
 */
Database.prototype.queryArgs = function(qString, args, callback) {
  pg.connect(this.setup, function(err, client, done) {
    if(err) {
      console.log('error from pg connect');
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
          callback(localErrorHandler('queryStmt', err, {query: qString}));
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
 * @param {Object} fvPairs - field/value pairs to build an assignment
 * @returns {String} string representation of SQL assignment clause
 */
function mkAssignment(fvPairs) {
  var _result = '';
  if(Object.keys(fvPairs).length > 0) {
    _result = _.map(fvPairs, function(value, key) {
      return key + '=' + (typeof value === 'number' ? value : '\'' + value + '\'');
    }).join(', ');
  }
  return _result;
}

/**
 * Form a valid SQL WHERE clause given a set of field/value pairs. Assumes
 * equality comparison.
 *
 * @param {Object} conjunction - field/value pairs to build a conjunction
 * @returns {String} string representation of SQL WHERE conjunction clause
 */
function mkWhere(conjunction) {
  var _where = '';
  if(Object.keys(conjunction).length > 0) {
    _where = _.map(conjunction, function(value, key) {
      var _key, _value;
      _key = Object.keys(value)[0];
      _value = value[_key];
      _value = typeof _value === 'number' ? _value : '\'' + _value + '\'';
      return key + _key + _value;
    }).join(' AND ');
    _where = 'WHERE (' + _where + ')';
  }
  return _where;
}

/**
 * Constructs a valid SQL FIELDS clause given a set of field names.
 *
 * @param {Array(String)} fields - a list of field names
 * @returns {String} string representation of SQL fields clause
 */
function mkFields(fields) {
  return '(' + fields.join(', ') + ')';
}

/**
 * Constructs a valid SQL VALUES clause given a set of values.
 *
 * @param {(String[]|Number[])} values - an array of values
 * @returns {String} string representation of SQL VALUES clause
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
 * @returns {String} string representation of SQL INSERT statement
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
Database.prototype.insert = function(table, fvPairs, callback) {
  this.queryStmt(mkInsert(table, fvPairs), function(err, result){
    if(err){
      err.method = 'Insert';
      callback(err);
    } else {  
      callback();
    }
  });
};

/**
 * Creates a valid SQL select statement given a table, fields to select, 
 * and a conjunction of field/values to screen against.
 *
 * @param {String} table    - the target table for insertion
 * @param {Array(String)} fields - a list of fields to present in the results
 * @param {Object} conjunct - a conjunction of field/value pairs to filter 
 * @returns {String} string representation of SQL SELECT statement
 */
function mkSelect(table, fields, conjunct) {
  var _head, _where, _fields;
  _fields = fields.length > 0 ? fields.join(', ') : '*';
  _head = 'SELECT ' + _fields + ' FROM ' + table;
  return _head + ' ' + mkWhere(conjunct);
}

/**
 * Selects the specified field values from all rows in a table that match a user
 * provided field/value conjunction.
 *
 * @private
 * @param {String} table      - target table for selection
 * @param {String} fields     - list of fields to return in display
 * @param {Object} conjunct   - set of key/value pairs to filter matching rows
 * @param {CallBack} callback - callback function to use
 */
Database.prototype._select = function(table, fields, conjunct, callback) {
  this.queryStmt(mkSelect(table, fields, conjunct), callback);
};

/**
 * Selects the specified field values from all rows in a table that match a user
 * provided field/value conjunction.
 *
 * @param {String} table      - target table for selection
 * @param [Array(String)] fields   - list of fields to return in display
 * @param {Object} conjunct   - set of key/value pairs to filter matching rows
 * @param {CallBack} callback - callback function to use
 */
Database.prototype.select = function() {
  if(arguments.length === 3) {
    this._select(arguments[0], [], arguments[1], arguments[2]);
  } else {
    this._select.apply(this, arguments);
  }
};

/**
 * Create a valid SQL statement that udpates a set of specified fields with new
 * values in the specified table that match the supplied conjunction of 
 * filed/value pairs.
 *
 * @param {String} table    - target table for selection
 * @param {Object} fvPairs  - selects the target field and updates with value
 * @param {Object} conjunct - conjunction of field/value pairs to filter update
 * @returns {String} string representation of SQL UPDATE statement
 */
function mkUpdate(table, fvPairs, conjunct) {
  return 'UPDATE ' + table + ' SET ' + mkAssignment(fvPairs) + ' ' + mkWhere(conjunct);
}

/**
 * Updates a set of rows in a table that match a field/value conjunction
 * using a set of field/value pairs.
 *
 * @param {String} table      - target table of operation
 * @param {Object} fvpairs    - set of field/value pairs to update
 * @param {Object} conjunct   - set of field/value pairs to filter
 * @param {CallBack} callback - callback function to use
 */
Database.prototype.update = function(table, fvPairs, conjunct, callback) {
  this.queryStmt(mkUpdate(table, fvPairs, conjunct), callback);
};

/**
 * Create a valid SQL statement that will delete a set of rows from a target
 * database where the conjunct fields match.
 *
 * @param {String} table    - target table of operation
 * @param {Object} conjunct - set of field/value pairs 
 * @returns {String} string representation of SQL DELETE statement
 */
function mkDelete(table, conjunct) {
  return 'DELETE FROM ' + table + ' ' + mkWhere(conjunct);
}

/**
 * Delete a set of rows from a table in the database whose field values match
 * the supplied field/value pairs.
 *
 * @param {String} table - target table of operation
 * @param {Object} conjunct - set of field/value pairs
 * @param {Callback} callback - callback function to use
 */
Database.prototype.delete = function(table, conjunct, callback) {
  this.queryStmt(mkDelete(table, conjunct), callback);
};

})();

