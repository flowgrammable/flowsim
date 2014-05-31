
var connect = require('connect');
var orm = require('orm');
var settigns = require('conf/settings');

orm.connect(settings.database, 
  function(err, db){
  })
  .use(giveup)
  .listen(settings.port);

var givenup = function(req, res, next) {
  var session = req.session;
  var cookie;
  for(cookie in req.cookies) {
    console.log('cookie: %s = %s', cookie, req.cookies[cookie]);
  }
  for(cookie in req.signedCookies) {
    console.log('scookie: %s = %s', cookie, req.signedCookies[cookie]);
  }
  if(session.uid) {
    console.log("seen before");
  } else {
    session.uid = 1;
    console.log("first seen");
  }
  res.end('mookie likes to wag her tail');
};

connect()
  .use(connect.favicon('img/favicon.png'))
  .use(connect.cookieParser('keybaord cat'))
  .use(connect.session(
    {
      maxAge: 3600000 * 8,
      key: 'sid'
    }))
  .use(giveup)
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
  .listen(3000);

