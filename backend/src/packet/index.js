
(function(){

var _ = require('underscore');

var v = require('./view');

var name = 'packet';

/**
 * @param {Object} ctx                            - configuration context
 * @param {module:database~Pg} ctx.database       - database engine
 * @param {module:template~Template} ctx.template - template engine
 * @param {module:mailer~Mailer} ctx.mailer       - SMTP engine
 * @param {module:logger-Logger} ctx.logger       - logger engine
 */
function Packet(ctx) {
  this.logger = ctx.logger.log.child({module: 'logger'});
  this.view       = new v.View(/*this.controller,*/ this.logger);

}
exports.Packet = Packet;

/**
 * The load method is called by a server when it is ready to load
 * the views http services. The view uses this signal to establish any
 * necessary preconditions to successful operation that haven't already
 * been established.
 *
 * @param {module:server~Server} server - a well constructed server
 */
Packet.prototype.load = function(server) {
  // For each service load the method/path/handler
  _.each(this.view.services, function(service) {
    var path = name + '/' + service.path;
    server.addHandler(service.method, path, service.handler);
  });
};

})();
