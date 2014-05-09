
var settings = {
  port : process.env.NODE_PORT || 3000,   // port to run server from
  favicon : 'img/favicon.png',            // location of favicon
  cookieKey : 'keyboard cat',             // key to sign cookies with
  html : 'html',                          // location of static content
  session : {
    maxAge: 3600000 * 8,    // max lifetime to keep cookie
    key: 'sid'              // publicly visible cookie 'key' name
  },
  database : {
    database : 'flowsim',   // Database name in DB server
    protocol : 'pg',        // pg = PostgreSQL protocol
    host : 'localhost',     // name of database server
    user : 'flogdev',       // database username to connect as
    password : 'flogdev',   // database username to connect as
  }
};

module.exports = settings;

