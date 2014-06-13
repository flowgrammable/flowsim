var database = require('./database.js');
var express = require('express');
var connect = require('connect');
var settings = require('./settings');

module.exports = function(server) {
	server.use(require('connect').bodyParser());
	server.use(express.static(__dirname + '/public'));
    
    server.use(function(req, res, next){
		database(function (err, db) {
			if(err) return next(err);
			req.models = db.models;
			req.db = db;
			return next();
		});
	});
}
