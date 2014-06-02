var fs = require('fs');
var http = require('http');
//file is coming from client going to via server to HD...at no point server has complete file, piece by piece file is put into HD
// But this brings another problem, what if writable stream slower than readable stream?? ---> using pipe solves the problem!!
//HOW?
/*
    when buffer is full, pipe pauses for buffer to drain, and then resumes filling buffer again....
    PAUSE WHEN writeStream IS FULL:
    ------------------------------
    readStream.on('data',function(chunk) {
        var buffer_good = writeStream.write(chunk); <--returns false if kernel buffer is full
        if(!buffer_good) readStream.pause();
});
    RESUME WHEN READY TO WRITE AGAIN:
    --------------------------------
    writeStream.on('drain',function() {
        readStream.resume();
    });
-----------------------------------------------------------------
                |
                |       
                _
            ALL ENCAPSULATED IN : readStream.pipe(writeStream);
-----------------------------------------------------------------
*/
http.createServer(function(request, response) {
    var newFile = fs.createWriteStream("uploadedFile.md");
    request.pipe(newFile);//

    request.on('end', function() {
        response.end('Uploaded!\n');  
    });
  }).listen(8000);

console.log("Type this in new terminal/browser:\n\tcurl --upload-file 'filename' http://localhost:8000");
console.log("Listening on port 8000....\n");

