
/**
 * @module utils
 */

(/** @lends module:utils */function(){

/**
 * This is a string formatter, it is used for providing
 * pretty printing of arbitrary objects to strings.
 *
 * @constructor
*/
function Formatter() {
  this.result = '';
  this.tab    = '  ';
  this.level  = 0;
}
exports.Formatter = Formatter;

/**
 * Returns a string verison of the formatter.
 *
 * @returns {String} a string version of the formatter.
 */
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
 * @param {String} name - the name of the current formatter block
 * @returns {Formatter} a reference to self
 */
Formatter.prototype.begin = function(name) {
  this.indent();
  this.result += name + ' {' + '\n';
  this.level += 1;
  return this;
};

/**
 * Used to end a formatter block.
 *
 * @returns {Formatter} a reference to self
 */
Formatter.prototype.end = function() {
  this.level -= 1;
  this.indent();
  this.result += '}';
  return this;
};

/**
 * Adds a field/value to the formatter.
 *
 * @param {String} field - attribute title of the pair
 * @param {Object} value - object that will be stringified
 * @returns {Formatter} returns a self reference
 */
Formatter.prototype.addPair = function(field, value) {
  this.indent();
  this.result += field + ': ' + value + '\n';
  return this;
};

/**
 * Adds a field/name/value to the formatter. 
 *
 * @param {String} field - attribute title of the pair
 * @param {String} name - string representation of value
 * @param {Object} value - object that will be stringified
 * @returns {Formatter} returns a self reference
 */
Formatter.prototype.addTriple = function(field, name, value) {
  this.indent();
  this.result += field + ': ' + name + '(' + value + ')' + '\n';
  return this;
};

/**
 * A toString funciton that can be added to *.prototype.toString of
 * objects that need this behavior.
 *
 * @returns {String} a stringified version of a formatter invoked against this
 */
function toString() {
  var fmt = new Formatter();
  this.toFormatter(fmt);
  return fmt.toString();
}
exports.toString = toString;

})();

