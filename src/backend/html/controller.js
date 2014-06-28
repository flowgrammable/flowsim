
var _ = require('underscore');

exports.serve = function(app, connect, config) {

  _.each(config.content, function(value, key) { 
    if(config.content.hasOwnProperty(key)) {
      if(key == 'favicon') {
        app.use(connect.favicon(config.base + '/' + value));
      } if(key == 'html') {
        _.each(value, function(dir) {
          app.use('/', connect.static(config.base + '/' + dir));
        });
      } else {
        _.each(value, function(dir) {
          app.use('/'+key, connect.static(config.base + '/' + dir));
        });
      }
    }
  });
}

