// Rest Controller
var url = require('url');

//import modules
var subscriber = require('./subscriber');

module.exports = 
function(req, res, next){ 
		var path = url.parse(req.url).pathname.split('/');
		var data = 'test data';
        var params = path.slice(2);


        // Call async subscriber module
        // once finished, unwrap async result, and respond to client
        subscriber.handleSubscriber(req.method, params, req.body, 
            function(result){ 
                console.log('got a result: ', result );
                res.end(result);
            });
}
