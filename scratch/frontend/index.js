#!/usr/bin/env node

var connect = require('connect');
var program = require('commander');

program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';

var app = connect()
  .use(connect.favicon('img/favicon.png'))
  .use('/fonts', connect.static('bower_components/bootstrap/dist/fonts'))
  .use('/css', connect.static('bower_components/bootstrap/dist/css'))
  .use('/js', connect.static('bower_components/angular'))
  .use('/js', connect.static('bower_components/angular-route'))
  .use('/js', connect.static('js'))
  .use(connect.static('html'))
  .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

