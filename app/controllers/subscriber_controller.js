module.exports = {
	list: function(req, res, next) {
		req.models.subscriber.find({status: 'REGISTER'}, function(err, subs){
			console.log(subs);
			console.log('hit subs');
                        res.end('getting subscribers');
		});
	},
	add: function(req, res, next) {
		var date = new Date();
		var tmp = date.toISOString();
		
		req.models.subscriber.create({
			email: req.body.email, 
			password: req.body.password,
			reg_date: tmp,
			reg_ip: req.body.ip
			}, function(err,subscriber){
				if(err) throw err;
				console.log('subs callback');
				res.send(req.body);
		});
}	
}
