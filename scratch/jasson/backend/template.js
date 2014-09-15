
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

module.exports = function(dir) {
  var name = 'template';
  var cfg = config.get(name);

  var templates = {};
  fs.readdir(cfg.dir, function(err, files) {
    if(err) throw err;
    files.forEach(function(file) {
      var basename = path.basename(file, '.ejs');
      var relname = cfg.dir + '/' + file;
      templates[basename] = fs.readFileSync(relname, 'utf8');
    });
  });

  function _render(template, ctx) {
    if(template in templates) {
      return ejs.render(templates[template], ctx);
    } else {
      throw 'Template not found: ' + template;
    }
  }

  return {
    render: _render
  };
};

