
(function(){

var _ = require('_');

var v = require('./view');
var s = require('./storage');
var c = require('./controller');

var name = 'subscriber';


/**
 * @param {Object} ctx                            - configuration context
 * @param {module:database~Pg} ctx.database       - database engine
 * @param {module:template~Template} ctx.template - template engine
 * @param {module:mailer~Mailer} ctx.mailer       - SMTP engine
 */
function Subscriber(ctx) {
  this.storage    = new s.Storage(ctx.database);
  this.controller = new c.Controller(this.storage, ctx.mailer, ctx.template);
  this.view       = new v.View(this.controller);
}

/**
 * The load method is called by a server when it is ready to load
 * the views http services. The view uses this signal to establish any
 * necessary preconditions to successful operation that haven't already
 * been established.
 *
 * @param {module:server~Server} server - a well constructed server
 */
Subscriber.prototype.load = function(server) {
  // For each service load the method/path/handler
  _.each(this.view.services, function(service) {
    var path = name + '/' + service.path;
    server.addHandler(service.method, path, service.handler);
  });

}

})();

