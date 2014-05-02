
var connect = require('connect');

function hello(req, res, next) {
}

connect()
  .use(connect.favicon('img/favicon.png'))
  .use('/css', connect.static('bower_components/bootstrap/dist/css'))
  .use('/css', connect.static('bower_components/bootstrap/dist/fonts'))
  .use('/js', connect.static('bower_components/angular'))
  .use('/js', connect.static('bower_components/angular-route'))
  .use('/js', connect.static('bower_components/ui-bootstrap/dist'))
  .use('/img', connect.static('img'))
  .use('/css', connect.static('css'))
  .use('/js', connect.static('js'))
  .use(connect.static('html'))
  .use(hello)
  .listen(8080);

