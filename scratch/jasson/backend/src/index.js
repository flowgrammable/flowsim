#!/usr/bin/env node

(function(){

// External dependencies
var fs   = require('fs');
var _    = require('underscore');
var prog = require('commander');

// Internal dependent modules
var dbs = require('./database/pg');
var mlr = require('./mailer');
var tmp = require('./template');
var srv = require('./server');
var sub = require('./subscriber');

// Process the command line
prog
  .version(process.env.SERVER_VERSION)
  .option('-c, --config [config file]', 'Specify a configuration file')
  .parse(process.argv);

// Initialize the configuration
var config     = require(prog.config || './config.json');
config.basedir = __dirname;

// Initialze global objects
var db         = new dbs.Database(config);
var mail       = new mlr.Mailer(config);
var template   = new tmp.Template(config);
var restServer = new srv.Server(config);

// Initialize the modules
var mods = [
  new sub.Subscriber({
    configuration: config,
    database: db,
    mailer: mail,
    template: template,
    server: restServer
  })
];

// Load each module into the rest server
_.each(mods, function(mod) {
  restServer.addModule(mod);
});

// Run the server
restServer.run();
console.log(restServer.toString());

})();

