var enforce = require('enforce');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var mailer = require("../mailer");
  
module.exports = 
{
  read: function(req, res, next) {
	  res.send('a list of subscribers');
  },

  create: function(req, res, next) {
    var date = new Date(),            
		tmp = date.toISOString(),    
    checks  = new enforce.Enforce();
    checks.add('password1',enforce.ranges.length(8,16, 'Password is not between 8-16 chars'));
    checks.add("password2",enforce.sameAs('password1', 'Passwords do not match'));
    checks.add('email',enforce.patterns.email('Invalid Email'));
    checks.check( {
      email: req.body.email,
      password1: req.body.password1,
      password2: req.body.password2
    }, function(err) {
      if(err) {
        res.writeHead('400', {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify( {
          error:err.msg
        }));
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
		            res.writeHead('409', {
                'Content-Type': 'application/json'
                });
				        res.end(JSON.stringify( {
                  message:'User with that email is already registered'
                }));
			          break;
		          default: res.end('dont know what went wrong'); 
		        }
	        } 
	        else {
            res.writeHead('201', {
              'Content-Type': 'application/json'
            });
		    		res.end(JSON.stringify( {
              message:'user registered sucessfully'
            }));

	          // Generate token
            var token = uuid.v1();

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
                res.writeHead('500', {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify( {
                  error:'Internal Service Error'
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
                pass: 'flowtester'
              }
            }   

            var messageOptions = {
              from: 'flog mailer', 
              to: subscriber.email, 
              subject: 'Verification Email', 
              html:'<html><title>Thank you for signing up for Flowsim</title><body>' + 
              'Thank you for signing up for Flowsim.<br/>Click the link below to confirm ' + 
              'your account<br/><br/><a href=\"https://localhost:8000/subscribers/verify/'+
              token+'\">https://www.flowgrammable.org/subscribers/verify/"+token+"</a><br/>' + 
              '<br/><h1>The Flowsim Team!</h1></body></html>'
            }
            
            mailer.sendMessage(mailerConfig, messageOptions, function(err) { 
            
              /* 
               *  TODO:
               *    HTTP error code??? 
               *      + Some problem with sending email?
               *        -->Either invalid inactive email address or not Internet connection available?
              */
              console.log(err);
            }); 
          }
        });
      }
    });
  },

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
        res.writeHead('404', {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify( {
          error:'Invalid token'
        }));
      }
      else {
        
        // If more than 1 =  error!!(Might be hash collision)
        if(token.length > 1) {
          res.writeHead('500', {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify( {
            error:'Internal Service Error'
          }));
        }
        var id = token[0][sub_id];
        req.models.subscriber.get(id,function(err,subscriber) {
          if(err) {
                        
            // No user of this id has registerd
            res.writeHead('404', {
              'Content-Type': 'application/json'
            });
            res.end(JSON.stringify( {
              error:'Invalid token'
            }));
          }
          else {
            subscriber.status = 'VERIFIED';
            subscriber.save(function(err) {
              if(err) {

              	//Error saving to the database
                res.writeHead('500', {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify( {
                  error:'Internal Service Error'
                }));
              }
              else {
                console.log('Saved successfully');
                res.writeHead('302', {
                  'Content-Type': 'application/json', 
                  'Location': '/#signin'
                });
                res.end(JSON.stringify( {
                  message:'email verification successful'
                }));
              }
            });
          }
        });
      }
    });
  }
}
