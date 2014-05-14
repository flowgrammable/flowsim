
var connect = require('connect');
var settings = require('./conf/settings');
var database = require('./database');
var profile = require('./profile/logic');


database.connect(settings.database, function(db) {
  db.load("./profile/profile_models", function(err) {
	if(err) throw err;
	});
  connect()
    .use('/api/profile',profile(db)) 
    .use(connect.static(settings.html))
    .use(function(req, res, next) {
        res.end('We dont know what you want');
      })
    .listen(settings.port);
  console.log('Server running on port: %d', settings.port);
});

