module.exports = {
	list: function(req, res, next) {
		req.models.subscriber.find({status: 'REGISTER'}, function(err, subs){
			console.log(subs);
			console.log('hit subs');
		});
	}
}
