var enforce = require('enforce'),
    bcrypt = require('bcrypt'),
    uuid = require('node-uuid'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    mailer = require("../mailer");

/*
 * @module subscriber
 */
  
module.exports = 
{
  read: function(req, res, next) {
    res.send('a list of subscribers');
  },

  /*
   * When a potential subscriber fills and submits the Sign-Up Page for Registration
   * this function is invoked, which is a two phase process where a potential 
   * subscriber registers a username and password. The system will email their 
   * username with a unique url to use for verification of the  ownership 
   * of the email address.
   * 
   * @method create
   * @param req - HTTP POST request object sent by potential subscriber
   * @param res - HTTP response object which will be sent to the potential subscriber
   * 
   */
  create: function(req, res, next) {
    var date = new Date(),            
        tmp = date.toISOString(),    
        checks  = new enforce.Enforce();
    checks.add("password2",enforce.sameAs('password1', {      
      'error': {
        'type': 'Registration',
        'description': 'Could not register user',
        'data': {
          'code': 1102,
          'message': 'Passwords do not match'
        }
      }
    }));
    checks.add('email',enforce.patterns.email( {      
      'error': {
        'type': 'Registration',
        'description': 'Could not register user',
        'data': {
          'code': 1103,
          'message': 'Invalid Email'
        }
      }
    }));
    checks.add('password1',enforce.ranges.length(8,16, {
      'error': {
        'type': 'Registration',
        'description': 'Could not register user',
        'data': {
          'code': 1104,
          'message': 'Password is not 8-16 chars'
        }
      }
    }));
    checks.check( {
      email: req.body.email,
      password1: req.body.password1,
      password2: req.body.password2
    }, function(err) {
      if(err) {
        res.writeHead('200', {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(err.msg));
      }
      else {
      	
        // validated in modules/subscriber/model.js
        req.models.subscriber.create( {
          email: req.body.email, 
          password: req.body.password1, 
          reg_date: tmp,
          reg_ip: req.connection.remoteAddress
        }, function(err,subscriber) {
          if(err) {
            switch(err.code) {

              // orm error code for duplicate unique
              case '23505':
                res.writeHead('200', {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify( {
                  'error': {
                    'type': 'Registration',
                    'description': 'Could not register user',
                    'data': {
                      'code': 110X,
                      'message': 'User with that email is already registered'
                    }
                  }
                }));
                break; 
              default: res.end('dont know what went wrong'); 
            }
          } 
          else {
            
            res.writeHead('200', { 
              'Content-Type': 'application/json'
            });
            res.end(JSON.stringify( {
              'data': {
                'result': 'success'
              }
            }));

            // Generate token
            var token = uuid.v1();
            req.token = token;
            /* 
             *  Store token in verification_token table
             *    + Associate token with registered user
             *    + Store token creation date
             */
            req.models.verification_token.create( {
              sub_id: subscriber.id,
              token: token,
              created_at: new Date() 
            }, function(err,ver_token) {
                            
              // Error storing in verification_token table in Database   
              if(err) {
                res.writeHead('200', {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify( {
                  'error': {
                    'type': 'Registration',
                    'description': 'Could not register user',
                    'data': {
                      'code': 110X,
                      'message': 'Internal Service Error'
                    }
                  }
                })); 
              }
              else {
                console.log('Token created successfully');
              }
            });

            //Send email containing token link
            var mailerConfig = {
              service:'gmail',
              auth:{
                user: 'flowgrammablemailer@gmail.com', 
                pass: 'flowtester2014'
              }
            }   

            var messageOptions = {
              from: 'flog mailer', 
              to: subscriber.email, 
              subject: 'Verification Email', 
              html:'<html><title>Thank you for signing up for Flowsim</title><body>' + 
              'Thank you for signing up for Flowsim.<br/>Click the link below to confirm ' + 
              'your account<br/><br/><a href=\"http://localhost:8000/api/subscribers/verify/'+
              token+'\">https://www.flowgrammable.org/subscribers/verify/'+token+'</a><br/>' + 
              '<br/><h1>The Flowsim Team!</h1></body></html>'
            }
            
            mailer.sendMessage(mailerConfig, messageOptions, function(err) { 
              
              // Some problem with sending email
              if(err) {
                res.writeHead('200', {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify( {
                  'error': {
                    'type': 'Registration',
                    'description': 'Could not register user',
                    'data': {
                      'code': 110X,
                      'message': 'Internal Service Error'
                    }
                  }
                }));
              }
            }); 
          }
        });
      }
    });
  },

  /*
   * Verification of E-mail address sent to the registered user
   * 
   * @method verify
   * @param req : HTTP GET request object sent by registered user
   * @param res : HTTP response object sent to the registered user
   *
   */
  verify: function(req, res, next) {
      
    // Get token from url
    var token_id = req.params.token;        
	    
    // Find token in database
    req.models.verification_token.find( {
      token:token_id
    }, function(err, token) {
			
      /*
       *  Set user associated with token to VERIFIED STATUS
       *  Respond with 'email verified' or 404 for invalid token
       */
      if(err || !token.length) {
        res.writeHead('200', {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify( {
          'error': {
            'type': 'Verification',
            'description': 'Could not verify user',
            'data': {
              'code': 110X,
              'message': 'Invalid Token'
            }
          }
        }));
      }
      else {
        
        // If more than 1 =  error!!(Might be hash collision)
        if(token.length > 1) {
          res.writeHead('200', {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify( {
            'error': {
              'type': 'Verification',
              'description': 'Could not verify user',
              'data': {
                'code': 110X,
                'message': 'Internal Service Error'
              }
            }
          }));
          console.log('Hash collision!!');
        }
        else {
          var id = token[0].sub_id;
          req.models.subscriber.get(id,function(err,subscriber) {
            if(err) {
                        
              // No user of this id has registerd
              res.writeHead('200', {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify( {
                'error': {
                  'type': 'Verification',
                  'description': 'Could not verify user',
                  'data': {
                    'code': 110X,
                    'message': 'Invalid Token'
                  }
                }
              }));
            }
            else {
              subscriber.status = 'VERIFIED';
              subscriber.save(function(err) {
                if(err) {

              	  //Error saving to the database
                  res.writeHead('200', {
                    'Content-Type': 'application/json'
                  });
                  res.end(JSON.stringify( {
                    'error': {
                      'type': 'Verification',
                      'description': 'Could not verify user',
                     'data': {
                        'code': 110X,
                        'message': 'Internal Service Error'
                      }
                    }
                  }));
                }
                else {
                  console.log('Saved successfully');
                  res.writeHead('200', {
                    'Content-Type': 'application/json', 
                    'Location': '/#signin'
                  });
                  res.end(JSON.stringify( {
                    'data': {
                      'result': 'success'
                      //'message': 'email verification successful'
                    }        
                  }));
                }
              });
            }
          });
        }
      }
    });
  },

  /**
   * Verified subscriber login
   * 
   * @method login
   * @param req : HTTP POST request object sent by verified user 
                  with form data as Username and password
   * @param res : HTTP response object sent to the verified user
   *
   */
  login: function(req,res,next) {
      req.models.subscriber.find({
        email: req.body.email
      },1,function(err,user) {
        if(err || !user[0]) {

          // Invalid Username
          res.writeHead('200', {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({
            'error' : 'invalid credentials'
            'error':{
              'type': 'authentication',
              'description': 'could not authenticate user',
              'data':{
                'code': 100X,
                'message': 'Username is invalid'
              }
            }
          }));
        }
        else {
          if(user[0].status != 'VERIFIED') {

            // User has not verified it's email address
            res.writeHead('200', {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({
              'error': {
                'type': 'authentication',
                'description': 'could not authenticate user',
                'data':{
                  'code': 1107,
                  'message': 'Account has not been verified'
                }
              }
            }));
          }
          else {
            bcrypt.compare(req.body.password,user[0].password,function(err,match) {
              if(err || !match) {

                // Invalid Password
                res.writeHead('200', {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  'error':{
                    'type': 'authentication',
                    'description': 'could not authenticate user',
                    'data':{
                      'code': 1005,
                      'message': 'Password is invalid'
                    }
                  }
                }));
              }
              else {
                var expires = moment().add('days', 7).valueOf();
                var token = jwt.encode({
                  iss: user[0].id,
                  exp: expires
                }, 'jwtTokenSecret');
                res.writeHead('200', {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  'data': {
                    'token': token
                  }
                }));
              }
            });
          }
        }
      });
  },

  /**
   * Authenticating requests
   * 
   * @method authReq
   * @param req : HTTP GET request object sent by verified user to access an api
   * @param res : HTTP response object sent to the verified user
   *
   */
  jwtauth: function(req, res, next) {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
      try {
        var decoded = jwt.decode(token, 'jwtTokenSecret');
        console.log(decoded);
        if (decoded.exp <= Date.now()) {
          res.end('Access token has expired', 400);
        }
        req.models.subscriber.find({ id: decoded.iss }, 1, function(err, user) {
          if(err) {
            res.writeHead('200', {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({
              'error': {
                'type': 'authentication',
                'description': 'could not authenticate user request',
                'data':{
                  'code': 1XXX,
                  'message': 'Internal Service Error'
                }
              }
            }));
          }
          else {
            req.user = user[0];
            next();
          }
        });
      } catch (err) {

        //Invalid token
        res.writeHead('200', {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({
          'error': {
            'type': 'authentication',
            'description': 'could not authenticate user request',
            'data':{
              'code': 1XXX,
              'message': 'Invalid Token'
            }
          }
        }));
      }
    } else {

      //No token passed...Hence cannot access api!!
      res.writeHead('200', {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({
        'error': {
          'type': 'authentication',
          'description': 'could not authenticate user request',
          'data':{
            'code': 1XXX,
            'message': 'Not Authorized'
          }
        }
      }));
    }
  }
}

