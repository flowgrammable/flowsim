
var url = require('url');
var querystring = require('querystring');

exports.rest = function() {
  return function (req, res, next) {
    req_url = url.parse(req.url);
    url_params = querystring.parse(req_url.query);
    target = req_url.pathname.split('/')[1];
    switch(req.method) {
      case 'POST':
        // HTTP POST = Create
        console.log('create_' + target + '(' + ')');
        break;
      case 'GET':
        // HTTP GET = Read
        console.log('read_' + target + '(' + ')');
        break;
      case 'PUT':
        // HTTP PUT = Update
        console.log('update_' + target + '(' + ')');
        break;
      case 'DELETE':
        // HTTP DELETE = Delete
        console.log('delete_' + target + '(' + ')');
        break;
      default:
        console.log('BAD METHOD: %s %s', req.method, req.url);
        break;
    }
    //res.end('%s %s\n', req.method, req.url);
    res.end('stuff');
  }

}
