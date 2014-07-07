var _ = require('underscore');

var msg = require('./msg');
// Testing async function return

var model = require('./model');

var subRegister = function(dataModel, method, params, data, cb){
    // validate inputs
    //if(!data.email) return cb(msg.missingEmail());

    dataModel.subscriber.create(data.email, data.password, function(result){
      // if result.success()
      if(result.success){
        dataModel.subscriber.sendVerification(data.email, function(result){
          if(result.success){
            cb(result);
          }
        });
      } else {
        cb(result.error); // 
      }
    });

}

module.exports = function(){
    var dataModel = model();
    return {
      module: {
        noauth: {
          register : _.bind(subRegister, null, dataModel)
        }
      }
    }
}

