
var connect = require('connect');

function hello(req, res, next) {
  res.end('Unknown File');
}

connect()
  .use('/css', connect.static('css'))
  .use('/js', connect.static('js'))
  .use(connect.static('html'))
  .use(hello)
  .listen(8080);

