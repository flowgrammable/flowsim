var url = require('url');

function login(db, username, password, res) {
  console.log('Auth - Login: %s/%s', username, password);
  res.end('logged in');
}

function logout(db, userid, res) {
  console.log('Auth - Logout: %s', userid);
  res.end('logged out');
}

function register(db, email, password, res) {
  console.log('Auth - Register: %s/%s', email, password);
  res.end('account registered');
}

function verify(db, email, key, res) {
  console.log('Auth - Verify: %s/%s', email, key);
  res.end('account verified');
}

function reset(db, email, res) {
  console.log('Auth - Reset: %s', email);
  res.end('We just sent a reset to your email');
}

module.exports = function(db) {
  //db.define(models);
  return function(req, res, next) {
    parts = url.parse(req.url, true);
    switch(parts.pathname) {
      case '/login':
        login(db, (parts.query.username || ''), (parts.query.password || ''),
              res);
        break;
      case '/logout':
        logout(db, (parts.query.userid || ''), res);
        break;
      case '/register':
        register(db, (parts.query.username || ''), (parts.query.password || ''), res);
        break;
      case '/reset':
        reset(db, (parts.query.username || ''), res);
        break;
      case '/verify':
        verify(db, (parts.query.username || ''), (parts.query.key || ''), res);
        break;
      default:
        res.end('Fuck you');
        break;
    }
  }
}
