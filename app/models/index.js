var orm = require('orm');
var settings = require('../../conf/settings');

var connection = null;

module.exports = function (cb) {
	if (connection) return cb(null, connection);
	console.log('in models index');

	orm.connect(settings.database, function (err, db) {
		if (err) return cb(err);

		connection = db;
		
		require('./subscriber')(orm, db);
		return cb(null, db);
	});
}
