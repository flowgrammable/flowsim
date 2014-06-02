var restify = require('restify');

var next_user_id = 0;
var users = {};

function addUser(req, res, next){
	console.log("Someone POSTed");
	var user = req.params;
	user.id = next_user_id++;
	users[user.id] = user;
	res.end(user.name + ' has been added');
}

function getAllUsers(req, res, next){
	console.log("Someone GETed /users/ to retrieve a list of users");
	res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
	res.end(JSON.stringify(users));
}

function getUser(req, res, next){
	console.log("Someone GETed /users/"+req.params.id);
	res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
	res.end(JSON.stringify(users[parseInt(req.params.id)]));
}

function editUser(req, res, next){
	console.log("Someone PUTed /users/"+req.params.id);
	var user = users[parseInt(req.params.id)];
	var changes = req.params;
	delete changes.id;
	for(var x in changes) {
		user[x] = changes[x];
		console.log(JSON.stringify(user[x]));
	}
	res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
	res.end(JSON.stringify(user));
}

function deleteUser(req, res, next){
	console.log("Someone DELETEd /users/"+req.params.id);
	delete users[parseInt(req.params.id)];
	res.end("User: " + req.params.id + " has been deleted");
}


var server = restify.createServer();

server.use(restify.bodyParser());  // middleware to parse the body of request
server.post('/users/', addUser);   // POSTing to this url will add a user 
server.get('/users/', getAllUsers); // GETting this url will return a list of all users
server.get('/users/:id', getUser);  // GETting this url will return the name of the user 
				    // who has id
server.put('/users/:id', editUser); // PUTting this url will edit the user with id
server.del('/users/:id', deleteUser); // DELETEing this url will remove the user with id
server.listen(3000);
