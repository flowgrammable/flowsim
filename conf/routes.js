//var controllers = require('../app/controllers');
var subscribers = require('../modules/subscriber');

module.exports = function (server) {
        subscribers(server);   // add subscribers to routes


//	server.get('/subscribers', controllers.subscribers.list); // list subscribers
//	server.post('/subscribers', controllers.subscribers.create);
}
