var database = require('./database.js');
var restify = require('restify');

module.exports = function(server) {
	server.use(require('connect').bodyParser());

	server.use(function(req, res, next){
		database(function (err, db) {
			if(err) return next(err);
			req.models = db.models;
			req.db = db;
			return next();
		});
	});
}
