var orm = require('orm');
var settings = require('../../conf/settings');

var connection = null;

module.exports = function (cb) {
	if (connection) return cb(null, connection);

	orm.connect(settings.database, function (err, db) {
		if (err) return cb(err);

		connection = db;
	
		// define models
		require('./subscriber')(db,orm);
		return cb(null, db);
	});
}
