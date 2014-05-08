
var settings = {
  port : process.env.NODE_PORT || 3000,
  database : {
    database : 'flowsim',   // Database name in DB server
    protocol : 'pg',        // pg = PostgreSQL protocol
    host : 'localhost',     // name of database server
    user : 'jasson',        // database username to connect as
  }
};

module.exports = settings;
