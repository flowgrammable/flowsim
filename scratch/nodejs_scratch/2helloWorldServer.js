var http = require('http');

http.createServer(function(request,response) { //<--request event
    response.writeHead(200);
    response.write("Wait for 5 seconds!!\n");
    setTimeout(function (){ //<--- timeout event
        response.write("Hello, World from nodejs..\n");
        response.end();
    },5000);
    }).listen(8000);

console.log("Type this in new terminal/browser:\n\tcurl http://localhost:8000");
console.log("Listening on port 8000....\n");

/*
| Request comes in, triggers request event
 || Request callback executes
    | setTimeout registered
      -->| Request comes in, triggers request event
          || Request callback executes
            | setTimeout registered
                                    | triggers setTimout event
                                     | setTimeout callback executes
                                        | triggers setTimeout event
                                         | setTimeout callback executes

calls out to web services
r/w on the db
calls to extension
all modules are non-blocking
*/
