#!/usr/bin/env node


require('./dbbs').setup();
var connect = require('connect');
var program = require('commander');
var cookieParser = require('cookie-parser'); 
var cookieSession = require('cookie-session');
var html = require('./html/controller');
var rest = require('./rest/controller');
var uuid = require('node-uuid');
var sessionAdapter = require('./session/adapter');

program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-b, --base [base html dir]', 'Specify a base dir for static files')
  .option('-d, --database [database file]', 'Specify a database file')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';
var config = program.config || process.env.CONFIG || './config';
var htmlbase = program.base || process.env.BASE || __dirname;
var database = program.database || process.env.DATABASE || './dbbs';

var app = connect();
// html.serve(app, connect, { base: htmlbase, content: require(config)});

app
  .use(cookieParser())
  .use(cookieSession({ secret: 'testsecret' }))
  .use(function(req, res, next){
    if (req.session.isNew == true) {
      req.session.id = uuid.v4();
      sessionAdapter.insertSession(req.session.id, req.connection.remoteAddress,
        function(result){ 
          if (result.error) console.log('error adding session to database');
          else console.log('session has been added to database');
          console.log(result); 
        });
      res.end('new session');
    }
    else res.end('existing session with id: '+req.session.id);
  }).listen(port, ip);


  // .use(connect.json())
  // .use('/api', rest(require(database), {}))
  // .use(function(req, res) {
  //   res.writeHead('404');
  //   res.end('');
  // })
  // .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

