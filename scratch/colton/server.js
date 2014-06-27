var express = require('express');
var server = express();

var knex = require('knex')({
		client: 'pg',
		connection: {
			host: '127.0.0.1',
			user: 'flogdev',
    	password: 'flogdev',
    	database: 'flowsim',
    	charset: 'utf8'
		}
});
var bookshelf = require('bookshelf')(knex);

var rest = require('./rest.js');
var modules = {};
server.use('/api', rest(modules,bookshelf));

server.listen(8000);

