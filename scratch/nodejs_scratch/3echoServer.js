/*
STREAMS?
 Processing data immediately
 request is readable stream
 response is writable stream

How to read from request?

Readable Stream inherits "EventEmitter" which emits two events:
    1) data
    2) end
*/
var http = require("http")
/*
http.createServer(function(request,response) {
    response.writeHead(200);
    //when there is data to receive it emits data event
    request.on('data',function(chunk) {
        //console.log(chunk.toString());
        response.write(chunk);
    });
    //when there is no data to receive it emits end event
    request.on('end',function() {
        response.end();
    });
}).listen(8000);*/

//Above thing can be written using pipe...

http.createServer(function(request,response) {
    response.writeHead(200);
    request.pipe(response);
}).listen(8000);
console.log("Type this in new terminal/browser:\n\tcurl -d 'Hello, World' http://localhost:8000");
console.log("Listening on port 8000....\n");

