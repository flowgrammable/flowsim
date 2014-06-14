
module.exports = function(db) {
  return function(req, res, next) {
    var session = req.session;
    if(session.count) {
      session.count++;
    } else {
      session.count = 1;
    }
    console.log('Session visit: %d', session.count);
    next();
  }
}

