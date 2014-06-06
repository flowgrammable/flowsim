var orm = require('orm');
var settings = require('./settings');

module.exports = function (cb) {

	orm.connect(settings.database, function (err, db) {
		if (err) return cb(err);
		connection = db;

		// define models
		require('../modules/subscriber/model.js')(db, orm);
		return cb(null, db);
	});
}
