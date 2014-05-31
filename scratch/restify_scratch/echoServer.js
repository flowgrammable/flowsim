var restify = require('restify')

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();

server.use(function(req,res,next){ 
    console.log("This will be displayed on console!!");
    next(); 
});

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8000, function() {
  console.log("\nOpen a new/terminal and type the following for output:\n\tcurl http://localhost:8000/hello/someName\n");
  console.log('%s listening at %s', server.name, server.url);
});

