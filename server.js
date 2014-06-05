var restify = require('restify');
var orm = require('orm');
var environment = require('./conf/environment');
var routes = require('./conf/routes');

// I dont think this belongs here ... the test code should be in a test
// folder for whatever module is being tested. This is the root entry point
// or our server. -Jasson
var request =  require('request');//For making HTTP requests in node JS

var server = restify.createServer();

environment(server);//Setting up the environment, passing server object.
routes(server);//Setting up routes for CRUD http methods.


server.get('/', function(req, res, next){
	console.log(req);
	res.end('my response');
	});

server.listen(8000);

//Invalid Email address
request({
  url: "http://localhost:8000/subscribers",
  body: "{ \"email\": \"user3user3.com\", \"password1\": \"my password\", \"password2\":\"my password\", \"ip\":\"83.72.61.50\" }",
  headers: {"Content-Type": "application/json"},
  method: "POST"
}, function (error, response, body) {
  console.log("Status : "+ response.statusCode);
//  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received : ", body);
});

//Email already exists
request({
  url: "http://localhost:8000/subscribers",
  body: "{ \"email\": \"user3@user3.com\", \"password1\": \"my password\", \"password2\":\"my password\", \"ip\":\"83.72.61.50\" }",
  headers: {"Content-Type": "application/json"},
  method: "POST"
}, function (error, response, body) {
  console.log("Status : "+ response.statusCode);
//  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received : ", body);
});

//Password length error
request({
  url: "http://localhost:8000/subscribers",
  body: "{ \"email\": \"user4@user3.com\", \"password1\": \"my\", \"password2\":\"my password\", \"ip\":\"83.72.61.50\" }",
  headers: {"Content-Type": "application/json"},
  method: "POST"
}, function (error, response, body) {
  console.log("Status : "+ response.statusCode);
//  console.log("Headers", JSON.stringify(response.headers));
  console.log("Response received : ", body);
});

