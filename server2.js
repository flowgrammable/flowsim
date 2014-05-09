
var connect = require('connect');
var settings = require('./conf/settings');
var database = require('./database');
var tracking = require('./tracking');
var auth = require('./auth');

database.connect(settings.database, function(db) {
  connect()
    .use(connect.favicon(settings.favicon))
    .use(connect.cookieParser(settings.cookieKey))
    .use(connect.session(settings.session))
    .use(tracking(db))
    .use(connect.static(settings.html))
    .use('/api/auth', auth(db))
    .use(function(req, res, next) {
        res.end('We dont know what you want');
      })
    .listen(settings.port);
  console.log('Server running on port: %d', settings.port);
});

