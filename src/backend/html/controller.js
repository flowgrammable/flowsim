
var _ = require('underscore');

exports.serve = function(app, connect, content) {

  var props = _.filter(content, function(prop) { 
    return content.hasOwnProperty(prop); 
  });

  _.each(props, function(prop) {
    if(prop = 'favicon') {
      app.use(favicon(content[prop]));
    } else {
      _.each(content[prop], function(dir) {
        app.use('/'+prop, connect.static(dir));
      });
    }
  });
}

