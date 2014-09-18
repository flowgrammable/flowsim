
(function(){

var fs   = require('fs');
var _    = require('underscore');
var path = require('path');
var ejs  = require('ejs');
var fmt  = require('../utils/formatter');

var name = 'template';

function Template(config) {
  var dir;

  this.config = config.get[name];
  this.templates = {};

  dir = config.basedir + '/' + this.config.dir;

  _.each(fs.readdirSync(dir, function(file) {
    var basename = path.basename(file, '.ejs');
    var relname = dir + '/' + file;
    this.templates[basename] = fs.readFileSync(relname, 'utf8');
  }));
}
exports.Template = Template;

Template.prototype.toFormatter = function(f) {
  f.begin('Template');
  f.end();
};

Template.prototype.toString = fmt.toString;

Template.prototype.render = function(id, ctx) {
  if(id in this.templates) {
    return ejs.render(this.templates[id], ctx);
  } else {
    // FIXME: this needs a better solution
    throw 'Template not found: ' + id;
  }
};

})();

