var restify = require('restify');

/*var pg = require('pg');
var connstring = "pg://vipul:1234@localhost/users";
pg.connect(connstring, function(err, client, done) {
    client.query('SELECT name FROM users WHERE email = $1', ['brian@example.com'], function(err, result) {
	    assert.equal('brianc', result.rows[0].name);
        done();
    });
});
*/
function menu_response (req, res, next) {
	var content= '<html><head><title> Main Menu</title></head><body>';
	content+='Enter username to view profile: <input type=\"text\" id=\"username\" />  <button onclick=\"window.location=\'http://localhost:8080/profile/\' + document.getElementById(\'username\').value\">Submit</button>';
	content += '</body></html>';
	res.writeHead(200, {
  		'Content-Length': Buffer.byteLength(content),
  		'Content-Type': 'text/html'
	});
	res.write(content);
	res.end();
	return next();
}

function user_response (req, res, next) {
	var content= '<html><head><title> User Profile</title></head><body>';
	content+='User: <b>' + req.params.username + '</b>';
	content+='<br/><br/> Profile details to be added';
	content += '</body></html>';
	res.writeHead(200, {
  		'Content-Length': Buffer.byteLength(content),
  		'Content-Type': 'text/html'
	});
	res.write(content);
	res.end();
	return next();
}

var server = restify.createServer();

server.get('/menu/',menu_response);

server.get('/profile/:username',user_response);

server.listen(8080);