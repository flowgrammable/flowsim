
var connect = require('connect');

function hello(req, res, next) {
  res.end('Unknown File');
}

connect()
  .use('/css', connect.static('bower_components/bootstrap/dist/css'))
  .use('/css', connect.static('bower_components/bootstrap/dist/fonts'))
  .use('/js', connect.static('bower_components/jquery/dist'))
  .use('/js', connect.static('bower_components/bootstrap/dist/js'))
  .use('/css', connect.static('css'))
  .use('/js', connect.static('js'))
  .use(connect.static('html'))
  .use(hello)
  .listen(8080);

