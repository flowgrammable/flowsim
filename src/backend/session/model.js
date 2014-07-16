var adapter = require('./adapter');
var uuid = require('node-uuid');
var msg = require('./msg');

function createSession(req, cb){
	req.session.id = uuid.v4();
	adapter.insertSession(req.session.id, req.connection.remoteAddress, function(result){
		if(result.value){
		   console.log('hit insert session success');
		   cb(msg.success());
		}
		//TODO: handle error
	});
}


module.exports = function(){
	return function(req, res, next){
    	if (req.session.isNew){
      		createSession(req, function(result){
      			console.log('callback from createSession');
        		if(result.value) next();
      		});
    	} else {
      		next();
    	}
	}
}
