
Formatter = function(name) {
  this.result = '';
  this.tab = '  ';
  this.level = 0;
}
exports.Formatter = Formatter;

Formatter.prototype.toString = function() {
  return this.result;
}

function indent(tab, level) {
  var result = '';
  for(var i=0; i<level; ++i) {
    result += tab;
  }
  return result;
}

Formatter.prototype.indent = function() {
  this.result += indent(this.tab, this.level);
}

Formatter.prototype.begin = function(name) {
  this.indent();
  this.result += name + ' {' + '\n';
  this.level += 1;
}

Formatter.prototype.end = function() {
  this.level -= 1;
  this.indent();
  this.result += '}';
}

Formatter.prototype.addPair = function(field, value) {
  this.indent();
  this.result += field + ': ' + value + '\n';
}

Formatter.prototype.addTriple = function(field, name, value) {
  this.indent();
  this.result += field + ': ' + name + '(' + value + ')' + '\n';
}

Formattable = function() {}
exports.Formattable = Formattable;

Formattable.prototype.toString = function() {
  var f = new Formatter();
  this.toFormatter(f);
  var result = f.toString();
  delete f;
  return result;
}
