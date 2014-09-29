
var session = require('cookie-session');
var connect = require('connect');

connect()
  .use(session({
    signed: true,
    maxage: 72000000
  }))
  .use('/', function(req, res, next) {
    if(req.session.isNew) {
      req.session.count = 1;
    } else {
      req.session.count = req.session.count + 1;
    }
    res.end("count: " + req.session.count);
  })
  .listen(3000);
