var subModel = require('../model.js');
var testAdapter = require('./testAdapter.js');

var model = subModel(testAdapter);


model.subscriber.create( 'test@test.com', 'mypassword', '127.0.0.1', function(result){
	console.log(result);
});

