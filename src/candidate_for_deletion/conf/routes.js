var subscribers = require('../modules/subscriber');
var profile = require('../modules/profile');

module.exports = function (server) {
        subscribers(server);   // add subscribers to routes
				profile(server); //add profile to routes
}
