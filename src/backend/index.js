#!/usr/bin/env node

var connect = require('connect');
var program = require('commander');
var rest = require('./rest/controller');
var db = require('./db');

program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';

var app = connect()
  .use(connect.favicon('../frontend/img/favicon.png'))
  .use('/img', connect.static('../frontend/img'))
  .use('/fonts', connect.static('../frontend/bower_components/bootstrap/dist/fonts'))
  .use('/css', connect.static('../frontend/bower_components/bootstrap/dist/css'))
  .use('/js', connect.static('../frontend/bower_components/bootstrap/dist/js'))
  .use('/js', connect.static('../frontend/bower_components/jquery/dist'))
  .use('/js', connect.static('../frontend/bower_components/angular'))
  .use('/js', connect.static('../frontend/bower_components/angular-route'))
  .use('/js', connect.static('../frontend/bower_components/angular-ui-bootstrap/dist'))
  .use('/css', connect.static('../frontend/css'))
  .use('/js', connect.static('../frontend/js'))
  .use(connect.static('../frontend/html'))
  .use(connect.json())
  .use('/api', rest(db, {}))
  .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

