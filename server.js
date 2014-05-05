
var connect = require('connect');
var settings = require('./config/settings');
var dispatcher = require('./dispatcher');

function giveup(req, res, next) {
  res.end('We don\'t know what you want\n');
}

connect()
  .use(connect.favicon('img/favicon.png'))
  .use(connect.bodyParser())
  .use('/api', dispatcher.rest())
  .use('/css', connect.static('bower_components/bootstrap/dist/css'))
  .use('/css', connect.static('bower_components/bootstrap/dist/fonts'))
  .use('/js', connect.static('bower_components/angular'))
  .use('/js', connect.static('bower_components/angular-route'))
  .use('/js', connect.static('bower_components/ui-bootstrap/dist'))
  .use('/img', connect.static('img'))
  .use('/css', connect.static('css'))
  .use('/js', connect.static('js'))
  .use(connect.static('html'))
  .use(giveup)
  .listen(settings.port);

