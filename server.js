
var connect = require('connect');
var url = require('url');
var querystring = require('querystring');

function giveup(req, res, next) {
  res.end('We don\'t know what you want\n');
}

function restServer(req, res, next) {
  console.log('method: %s, url: %s', req.method, req.url);
  obj = url.parse(req.url);
  console.log('host: %s', obj.hostname);
  console.log('path: %s', obj.pathname);
  params = querystring.parse(obj.query);
  for(var param in params) {
    console.log('%s=%s', param, params[param]);
  }
  switch(req.method) {
    case 'GET':
      console.log('get: %s', req.url);
      break;
    case 'PUT':
      console.log('put: %s', req.url);
    case 'POST':
      console.log('post: %s', req.url);
      console.log('username: %s, password: %s', req.body.username, req.body.password);
      for(var item in req.body) {
        console.log('%s=%s', item, req.body[item]);
      }
      break;
    case 'DELETE':
      console.log('delete: %s', req.url);
      break;
    default:
      console.log('method: %s, url:%s', req.method, req.url);
  }
  console.log(req.headers);
  res.end('Fuck you\n');
}

connect()
  .use(connect.favicon('img/favicon.png'))
  .use(connect.bodyParser())
  .use('/api', restServer)
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
  .listen(8080);

