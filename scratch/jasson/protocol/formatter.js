
exports.Formatter = function(name) {
  this.result = '';
  this.tab = '  ';
  this.level = 0;
}

exports.Formatter.prototype.toString = function() {
  return this.result;
}

function indent(tab, level) {
  var result = '';
  for(var i=0; i<level; ++i) {
    result += tab;
  }
  return result;
}

exports.Formatter.prototype.indent = function() {
  this.result += indent(this.tab, this.level);
}

exports.Formatter.prototype.begin = function(name) {
  this.indent();
  this.result += name + '{' + '\n';
  this.level += 1;
}

exports.Formatter.prototype.end = function() {
  this.level -= 1;
  this.indent();
  this.result += '}';
}

exports.Formatter.prototype.addPair = function(field, value) {
  this.indent();
  this.result += field + ': ' + value + '\n';
}

exports.Formatter.prototype.addTriple = function(field, name, value) {
  this.indent();
  this.result += field + ': ' + name + '(' + value + ')' + '\n';
}

