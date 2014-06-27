var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
   console.log('someone hit auth');
   var token = req.get('x-access-token');
   if(token){
		console.log('got a token');
    var decoded = jwt.decode(token, 'jwtTokenSecret');
    if (decoded.exp <= Date.now()){
				//token is expired 
        //redirect to login
    }
    //req authenticated by subscriber id
    req.subscriber_id = decoded.iss;
    next();
    
   }else{
		console.log('dont have a token');
    //send unauthenticated message
    res.writeHead('200', {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
       "error":{
          "category":"authentication.subscriber",
          "code": 5,
          "description":"user has not authenticated"
       }
    }));
	}
}
