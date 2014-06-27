var database = require('./database.js');
var express = require('express');
var connect = require('connect');
var settings = require('./settings');
var bodyParser = require('body-parser');

module.exports = function(server) {
	server.use(bodyParser.json());
    server.use(function(req, res, next){
      if(server.get('mode')=='d')
        req.mode = 'd';
		database(function (err, db) {
			if(err) return next(err);
			req.models = db.models;
			req.db = db;
			return next();
		});
	});
}
