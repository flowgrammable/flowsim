var msg = require('../msg.js');

function insertSubscriber(em, pwd, ip, cb){
cb(msg.success('a sub object'));
}

function sendVerificationEmail(em, cb){
cb(msg.success());
}

exports.insertSubscriber = insertSubscriber;
exports.sendVerificationEmail = sendVerificationEmail;
