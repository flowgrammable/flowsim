var subscriber = require('./controller.js');

module.exports = function(server) {
	server.get('/subscribers', subscriber.read);
	server.post('/subscribers', subscriber.create);
  server.get('/subscribers/verify/:token', subscriber.verify);
  server.post('/subscribers/login',subscriber.login);
  server.get('/subscribers/api/:access_token',subscriber.authReq);

}
