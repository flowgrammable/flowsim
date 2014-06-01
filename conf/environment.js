var models = require('../app/models/');
var restify = require('restify');

module.exports = function(server) {
	server.use(require('connect').bodyParser());

	server.use(function(req, res, next){
		console.log('bodyparser not working?');
		console.log(req.body.email);
		next();
	});
	server.use(function(req, res, next){
		console.log(req.body);
		models(function (err, db) {
			if(err) return next(err);
			req.models = db.models;
			req.db = db;
			return next();
		});
	});
}
