#!/usr/bin/env node

var connect = require('connect');
var program = require('commander');
var html = require('./html/controller');
var rest = require('./rest/controller');
var db = require('./db');

program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';

content = {
  favicon: '../frontend/img/favicon.png',
  fonts: [ '../frontend/bower_components/bootstrap/dist/fonts' ],
  css: [ '../frontend/bower_components/bootstrap/dist/css', '../frontend/css' ],
  img: [ '../frontend/img' ],
  html: [ '../frontend/html' ],
  js: [ '../frontend/bower_components/bootstrap/dist/js', 
    '../frontend/bower_components/jquery/dist', 
    '../frontend/bower_components/angular',
    '../frontend/bower_components/angular-route',
    '../frontend/bower_components/angular-ui-bootstrap/dist',
    '../frontend/js'
  ]
};

var app = connect();
html.serve(app, connect, require('./conf'));

app
  .use(connect.json())
  .use('/api', rest(db, {}))
  .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

