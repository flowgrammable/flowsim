#!/usr/bin/env node

require('./dbbs').setup();
require('./rest/subscriber/adapter.js').clearTimeouts();
var connect = require('connect');
var program = require('commander');
var html = require('./html/controller');
var rest = require('./rest/controller');
var fs = require('fs');
var profile_mod = require('./rest/profile/controller');
// var session = require('./session');
var prof = profile_mod();


program
  .version(process.env.SERVER_VERSION)
  .option('-p, --port [tcp port]', 'Specify a listening port')
  .option('-a, --address [ip address]', 'Specify a listening ip address')
  .option('-c, --config [config file]', 'Specify a configuration file')
  .option('-b, --base [base html dir]', 'Specify a base dir for static files')
  .option('-d, --database [database file]', 'Specify a database file')
  .option('-t, --test', 'Run server in test mode')
  .parse(process.argv);

var port = program.port || process.env.PORT || 3000;
var ip = program.address || process.env.ADDRESS || '127.0.0.1';
var config = program.config || process.env.CONFIG || './config';
var htmlbase = program.base || process.env.BASE || __dirname;
var database = program.database || process.env.DATABASE || './dbbs';

var app = connect();
html.serve(app, connect, { base: htmlbase, content: require(config)});

if(program.test) {
  fs.createWriteStream('temp','utf8');
}

var profileId = 0;
var profileList = [];

var packetId = 0;
var packetList = [];
function findById(source, id){
	for (var i = 0; i < source.length; i++){
		if(source[i].id === id){
			return i;
		}
	}
	throw "couldnt find object with id: " + id;
}

app
   .use(connect.json())
	 .use('/api/packet', function(request, response, next){
			if(request.method == 'POST'){
				packetList.push({id: packetId++, name: request.body.name});
				response.end(JSON.stringify({value:{}}));
			} else if(request.method == 'GET'){
				response.end(JSON.stringify({value:{packetList:packetList}}));
			} else if(request.method == 'PUT'){
			  var oldindex = findById(packetList, request.body.id);
				if(request.body.id && request.body.name){
				packetList[oldindex] = {id: request.body.id, name: request.body.name};
				response.end(JSON.stringify({value:{}}));
				} else {
				packetList.splice(oldindex,1);
				response.end(JSON.stringify({value:{}}));
				}
			} 
			
		})
   .use('/api', rest(require(database), {profile: prof.module}))
   .use(function(req, res) {
     res.writeHead('404');
     res.end('');
   })
   .listen(port, ip);

console.log('Server started on: %s:%d', ip, port);

