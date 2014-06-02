//Create a file "readme.md" to run it
var fs = require('fs'); //require filesystem module

var file = fs.createReadStream("testFile.md");
var newFile = fs.createWriteStream("testFile_copy.md");
file.pipe(newFile);

console.log("testFile.md is copied to testFile_copy.md\n");
