var subscriber = require('./controller.js');

module.exports = function(server) {
	server.get('/api/subscribers', subscriber.read);
	server.post('/api/subscribers', subscriber.create);
  server.get('/api/subscribers/verify/:token', subscriber.verify);


}
