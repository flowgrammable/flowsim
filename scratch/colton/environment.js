var bodyparser = require('body-parser');

module.exports = function(server) {
var knex = require('knex')({
	client: 'pg',
  connection: {
    host: 'localhost',
    user: 'flogdev',
    password: 'flogdev',
    database: 'flowsim',
    charset : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);
server.set('bookshelf', bookshelf);
server.use(bodyparser.json());

}
