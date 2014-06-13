var subscribers = require('../modules/subscriber');

module.exports = function (server) {
        subscribers(server);   // add subscribers to routes
}
