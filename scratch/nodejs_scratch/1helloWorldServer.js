/*
BUILT ON V8-JAVASCRIPT RUNTIME
Node registers events:
    1st is request event
    then it goes in event loop
    check for events

event processed one at a time from event queue!!
*/
var http = require('http');

http.createServer(function(request,response) {
    response.writeHead(200);
    response.write("Hello, World.\n");
    response.end();
}).listen(8000);

console.log("Type this in new terminal/browser:\n\tcurl http://localhost:8000");
console.log("Listening on port 8000....\n");
