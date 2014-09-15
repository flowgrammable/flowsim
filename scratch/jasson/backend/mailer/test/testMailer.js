
var mailer = require('../mailer');

var mlr = mailer.mailer('gmail', 'info@compilednetworks.com', '$NtheBank!Steve');

var ctx = {
  baseUrl: 'http://localhost:3000',
  token: '1234567890'
};

console.log("blorp");

//mlr.close();

