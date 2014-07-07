// Rest Controller
var url = require('url');

//import modules
var subscriber = require('./subscriber');

module.exports = 
function(req, res, next){ 
		var path = url.parse(req.url).pathname.split('/');
        var params = path.slice(2);

        // dispatch module by path
        // need to add checks to see module contains auth and noauth
        switch(path[1]){
            case 'subscriber':
                 // call async subscriber module
                 // once finished, unwrap result, and respond to client
                 subscriber.handleSubscriber(req.method, params, req.body, 
                    function(result){ 
                        console.log('got a result: ', result );
                        res.end(result);
                    });
            break;
            default:
            res.end('module does not exist');
       }
}
