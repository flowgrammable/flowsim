
var settings = {
  port : process.env.NODE_PORT || 3000,
  database : {
    database : 'flowsim',
    protocol : 'pg',
    host : 'localhost',
    user : 'jasson',
    password : '1234'
  }
};

module.exports = settings;
