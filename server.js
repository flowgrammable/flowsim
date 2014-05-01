
var connect = require('connect');

function hello(req, res, next) {
  res.end('Sup homes');
}

connect()
  .use(hello)
  .listen(8080);

