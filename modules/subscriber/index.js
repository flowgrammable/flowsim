var subscriber = require('./controller.js');

module.exports = function(server) {
	server.get('/subscribers', subscriber.read);
	server.post('/subscribers', subscriber.create);
}
