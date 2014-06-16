var profile = require('./controller.js');

module.exports = function(server) {
//	server.get('/profile', profile.list);
	server.post('/profile', profile.create);
//  server.post('/profile', passport.authenticate('bearer'), profile.create);
//  server.get('/profile/:id', passport.authenticate('bearer'), profile.read);


}
