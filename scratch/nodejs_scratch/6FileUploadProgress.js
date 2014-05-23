var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
    var newFile = fs.createWriteStream("uploadedFile.md");
    var fileBytes = request.headers['content-length'];
    var uploadedBytes = 0;
    
    request.pipe(newFile);
    
    request.on('data',function(chunk) {
        uploadedBytes += chunk.length;
        var progress = (uploadedBytes / fileBytes) * 100;
        response.write("Progress: " + parseInt(progress,10) + "%\n");
    });
    request.on('end', function() {
        response.end("Uploaded!\n");
    });



}).listen(8000);

console.log("Type this in new terminal/browser:\n\tcurl --upload-file 'largeFileName' http://localhost:8000");
console.log("Listening on port 8000....\n");

