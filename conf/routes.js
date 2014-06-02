var controllers = require('../app/controllers');

module.exports = function (server) {
	server.get('/subscribers', controllers.subscribers.list); // list subscribers
	server.post('/subscribers', controllers.subscribers.create);
}
