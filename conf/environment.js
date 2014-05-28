var models = require('../app/models/');
var restify = require('restify');

module.exports = function(server) {
	server.use(restify.bodyParser());

	server.use(function(req, res, next){
		console.log('hit models');
		models(function (err, db) {
			if(err) return next(err);
			console.log('in models passed to ofuncion');
			req.models = db.models;
			req.db = db;
			return next();
		});
		console.log('after models');
	});
}
