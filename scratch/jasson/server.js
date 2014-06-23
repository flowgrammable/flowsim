#!/usr/bin/env node

var program = require('commander');
var connect = require('connect');
var html = require('html');
var apis = require('apis');

program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';

var conn = connect()
  .use(connect.logger);

add_static(conn, conf.favicon);
add_static(conn, '/css', conf.css);
add_static(conn, '/js', conf.js);
add_static(conn, '/img', conf.img);

  .use('/apis/', apis.dispatcher)
  .use('/', html.content)

conn.listen(port, ip);
console.log('Server started on: %s:%d', ip, port);

