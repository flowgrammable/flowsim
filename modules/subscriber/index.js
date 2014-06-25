var subscriber = require('./controller.js');

module.exports = function(server) {
  server.all('/api/subscribers/*',subscriber.jwtauth,function(req,res,next) {
    next();
  });
	server.get('/api/subscribers', subscriber.read);
	server.post('/api/subscribers', subscriber.create);
  server.get('/api/subscribers/verify/:token', subscriber.verify);
  server.post('/api/login',subscriber.login);
}
