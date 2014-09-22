
/**
 * @module utils
 */

(/** @lends module:utils */function(){

/**
 * This is a string formatter.
 *
 * @constructor
*/
function Formatter(name) {
  this.result = '';
  this.tab = '  ';
  this.level = 0;
}
exports.Formatter = Formatter;

Formatter.prototype.toString = function() {
  return this.result;
};

function indent(tab, level) {
  var result = '';
  for(var i=0; i<level; ++i) {
    result += tab;
  }
  return result;
}

Formatter.prototype.indent = function() {
  this.result += indent(this.tab, this.level);
  return this;
};

/**
 * Used to begin a formatter block.
 *
 * @param {string} name - string name to use as formatter heading
 */
Formatter.prototype.begin = function(name) {
  this.indent();
  this.result += name + ' {' + '\n';
  this.level += 1;
  return this;
};

/**
 * Used to end a formatter block.
 */
Formatter.prototype.end = function() {
  this.level -= 1;
  this.indent();
  this.result += '}';
  return this;
};

/**
 * Used to add a '<name>: <value>' pair line to the formatter object.
 *
 * @param {string} field - attribute title of the pair
 * @param {*} value - object that will be string serialized as value
 * @returns {Formatter} returns 'this' formatter instance
 */
Formatter.prototype.addPair = function(field, value) {
  this.indent();
  this.result += field + ': ' + value + '\n';
  return this;
};

/**
 * Used to add a '''<name>: <name>(<value>)''' triple to the formatter object.
 *
 * @param {string} field - one
 * @param {string} name - two
 * @param {*} value - value
 */
Formatter.prototype.addTriple = function(field, name, value) {
  this.indent();
  this.result += field + ': ' + name + '(' + value + ')' + '\n';
  return this;
};

/**
 * Returns a string representation of the formatter object.
 */
function toString() {
  var fmt = new Formatter();
  this.toFormatter(fmt);
  return fmt.toString();
}
exports.toString = toString;

})();

