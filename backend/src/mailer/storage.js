(function(){ 

  var pg = require('../database/pg');

function Storage(db, log){
  this.database = db;
  this.logger = log.child({component:'storage'});
}
exports.Storage = Storage;

Storage.prototype.insertMailerSubscriber = function(fname, 
  lname, email, company, subToken, callback){
 this.database.insert('mailinglist', {
    firstname: fname,
    lastname: lname,
    email: email,
    company: company ? company : 'n/a',
    token: subToken,
    state: 'ACTIVE' 
 }, function(err, result) { if(err) {
      that.logger.error(err);
      callback(err); 
    } else {
      callback(null, result[0]);
    }
});
};

Storage.prototype.setSubInactive= function(subToken, callback){
  this.database.update('mailinglist', {
    state: 'INACTIVE'
  }, {
    id: {'=' : subToken }
  }, function(err, result){
    if(err){
      //add logger
      callback(err);
    } else {
      callback(null, result[0]);
    }
  });
};


})();
