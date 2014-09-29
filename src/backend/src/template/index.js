
/**
 * @module template
 * @requires module:utils~Formatter
 */

(/** @lends module:template */function(){

var fs   = require('fs');
var _    = require('underscore');
var path = require('path');
var ejs  = require('ejs');
var fmt  = require('../utils/formatter');

var name = 'template';

/**
 * Constructs a template cache for reading a directory of templates
 * and providing named render functionality.
 *
 * @constructor
 * @param {Ojbect} config     - a template configuration object
 * @param {String} config.dir - a directory containing templates
 */
function Template(config) {
  var dir, that;

  this.config = config[name];
  this.templates = {};

  dir = config.basedir + '/' + this.config.dir;

  that = this;
  _.each(fs.readdirSync(dir), function(file) {
    var basename = path.basename(file, '.ejs');
    var relname = dir + '/' + file;
    that.templates[basename] = fs.readFileSync(relname, 'utf8');
  });
}
exports.Template = Template;

Template.prototype.toFormatter = function(f) {
  f.begin('Template');
  f.end();
};

Template.prototype.toString = fmt.toString;

/**
 * Given the name of a template and a context, located the desired template
 * and render using the supplied context.
 *
 * @param {String} id - the name of the template to render
 * @param {Object} ctx - a context object holding template variable values
 * @returns {String} a rendered template
 */
Template.prototype.render = function(id, ctx) {
  if(id in this.templates) {
    return ejs.render(this.templates[id], ctx);
  } else {
    // FIXME: this needs a better solution
    throw 'Template not found: ' + id;
  }
};

})();

