var fs = require('fs');
var ejs = require('ejs');

fs.readFile('index.ejs', 'utf8', function(err,data) {
  if(err) {
    console.log('Error: ' + err);
  } else {
    console.log('Before: ' + data);
    console.log('----------------------------');
    console.log('After: ' + ejs.render(data, {
      title: 'Flowgrammable',
      styles: [
        '../bower_components/bootstrap/dist/css/bootstrap.min.css'
      ],
      scripts: [
        'flowgrammable.js'
      ],
      body: 'blah blah blah'
    }));
  }
});
