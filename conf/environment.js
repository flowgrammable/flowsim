var database = require('./database.js');
var restify = require('restify');
var connect = require('connect');
var settings = require('./settings');

module.exports = function(server) {
	server.use(require('connect').bodyParser());
	server.get('/js/:filename',  restify.serveStatic({directory: 'public'}));
	server.get('/img/:filename', restify.serveStatic({directory: 'public'}));
	server.get('/css/:filename', restify.serveStatic({directory: 'public'}));
	server.get('/html/:filename', restify.serveStatic({directory: 'public'}));
	server.get('/', restify.serveStatic({directory: 'public',
				default: 'html/index.html'}));
	server.use(function(req, res, next){
		database(function (err, db) {
			if(err) return next(err);
			req.models = db.models;
			req.db = db;
			return next();
		});
	});
}
