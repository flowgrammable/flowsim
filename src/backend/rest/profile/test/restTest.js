var orm = require('../../../dbbs');
var Profile = orm.model("switch_profile");
var request = require('request');
var assert = require('assert');
var fs = require('fs');

//orm.setup()
var token, sessKey;

// ----------------------------------------------------------------------------
// Testing create profile
describe('Testing create profile requests:',function() {
  // Register, verify, then login a subscriber
  before(function(done) { 
    /*request( { // register subscriber
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"flowgrammablemailer@gmail.com\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      console.log(body);
      assert(JSON.parse(body)['value'],'Unable to register user');
      fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
        if (err) console.log('Unable to read token in file for restTest');
        else {
          var array = data.toString().split("\n"); 
          token = JSON.parse(array[0]).ver_token;
          request( { // verify subscriber
            url: 'http://localhost:3000/api/subscriber/verify/',
            body: '{ \"token\": \"'+token+'\"}',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
          }, function (error, response, body) { 
            assert(JSON.parse(body)['value'],'Unable to verify user');*/
            request( { // login subscriber
              url: 'http://localhost:3000/api/subscriber/login',
              body: '{ \"email\": \"flowgrammablemailer@gmail.com\", \"password\": \"my password\"}',
              headers: { 'Content-Type': 'application/json' },
              method: 'POST'
            }, function (error, response, body) {
              assert(JSON.parse(body)['value'],'Unable to login user');
              sessKey = JSON.parse(body)['value'];
              done();
            });
         /* });
        }
      });
    });*/
  });
  it('A request that is successful should return msg.success()',
  function(done) {
    request( {
      url: 'http://localhost:3000/api/profile/create',
      body: '{ \"name\": \"test profile\", \"ofp_version\": \"10\"}',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\tResponse received : ', body);
      assert(JSON.parse(body)['value'],'Unable to create profile');
      //console.log('\tResponse received : ', body);
      done();
    }); 
  });
  it('A request with a missing name should return msg.missingName()',
  function(done) {
    request( {
      url: 'http://localhost:3000/api/profile/create',
      body: '{ \"name\": \"\", \"ofp_version\": \"10\"}',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingName');
      console.log('\tResponse received : ', body);
      done();
    }); 
  });

  it('Test: any method but POST should return msg.methodNotSupported()',
  function(done) {
    request({
      url: 'http://localhost:3000/api/profile/create',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'GET',
      method: 'PUT',
      method: 'DELETE'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'methodNotSupported');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});

// --------------------------------------------------------------------------
// Testing update profile
describe('Testing update profile request: ', function() {

	it('Test: Successful update of profile PUT /api/profile/update {id: id, name: name} should return msg.success()', 
	function(done) {
		request( {
			url: 'http://localhost:3000/api/profile/update',
			body: '{\"id\": \"1\", \"name\": \"test profile\", \"ofp_version\" : \"10\" }',
			headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
                        method: 'PUT'
                }, function (error, response, body) {
                        assert(JSON.parse(body)['value'],'Unable to update profile');
                        console.log('\tResponse received : ', body);
                        done();
		});
	});

	it('Test: PUT to /api/profile/update without an id in the body should return msg.missingId()', 
	function(done) {
		request( {
			url: 'http://localhost:3000/api/profile/update',
			body: '{ \"name\": \"test profile\", \"ofp_version\" : \"10\" }',
		   	headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
   			method: 'PUT'
 		}, function (error, response, body) {
			assert.equal(JSON.parse(body)['error']['type'],'missingId');
			console.log('\tResponse received : ', body);
      			done();
    		});
  	});
	
        it('Test: PUT to /api/profile/update without an ofp_Version should return msg.missingofpversion()',
        function(done) {
                request( {
                        url: 'http://localhost:3000/api/profile/update',
                        body: '{ \"name\": \"test profile\", \"id\" : \"1\" }',
                        headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
                        method: 'PUT'
                }, function (error, response, body) {
                        assert.equal(JSON.parse(body)['error']['type'],'missingOfpVersion');
                        console.log('\tResponse received : ', body);
                        done();
                });
        });

	before(function(done) {
	  this.timeout(5000);
	  request( {
	    url: 'http://localhost:3000/api/subscriber/logout',
            body: '{ \"email\": \"flowgrammablemailer@gmail.com\", \"password\": \"my password\"}',
            headers: {'Content-Type': 'application/json','x-access-token': sessKey},
            method: 'POST'
          }, function (error, response, body) {
            assert(JSON.parse(body)['value'],'Unable to logout user');
            console.log('\tResponse received : ', body);
	  request( { // register anoter subscriber
	    url: 'http://localhost:3000/api/subscriber/register',
      	    body: '{ \"email\": \"flowgrammabltest1@gmail.com\", \"password\": \"openflow1\"}',
      	    headers: { 'Content-Type': 'application/json' },
      	    method: 'POST'
    	  }, function (error, response, body) {
      	    console.log(body);
      	    assert(JSON.parse(body)['value'],'Unable to register user');
      	    fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
            if (err) console.log('Unable to read token in file for restTest');
            else {
              var array = data.toString().split("\n");
              token = JSON.parse(array[0]).ver_token;
              request( { // verify subscriber
            	url: 'http://localhost:3000/api/subscriber/verify/',
            	body: '{ \"token\": \"'+token+'\"}',
            	headers: { 'Content-Type': 'application/json' },
            	method: 'POST'
              }, function (error, response, body) {
            	assert(JSON.parse(body)['value'],'Unable to verify user');
                request( { // login subscriber
              	url: 'http://localhost:3000/api/subscriber/login',
              	body: '{ \"email\": \"flowgrammabltest1@gmail.com\", \"password\": \"openflow1\"}',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST'
            	}, function (error, response, body) {
              	  assert(JSON.parse(body)['value'],'Unable to login user');
              	  sessKey = JSON.parse(body)['value'];
              	  request( { // make another profile
      		    url: 'http://localhost:3000/api/profile/create',
      		    body: '{ \"name\": \"test2profile\", \"ofp_version\": \"10\"}',
      		    headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      		    method: 'POST'
    	      	  }, function (error, response, body) {
      		    assert(JSON.parse(body)['value'],'Unable to create profile');
      		    console.log('\tResponse received : ', body);
      		    request( { //logout
      		      url: 'http://localhost:3000/api/subscriber/logout',
      		      body: '{ \"email\": \"flowgrammabltest1@gmail.com\", \"password\": \"openflow1\"}',
      		      headers: {'Content-Type': 'application/json','x-access-token': sessKey},
      		      method: 'POST'
    		    }, function (error, response, body) {
      		      assert(JSON.parse(body)['value'],'Unable to logout user');
      		      console.log('\tResponse received : ', body);
      	 	      request( { // login subscriber 1
             	        url: 'http://localhost:3000/api/subscriber/login',
               	        body: '{ \"email\": \"flowgrammablemailer@gmail.com\", \"password\": \"my password\"}',
              	        headers: { 'Content-Type': 'application/json' },
                        method: 'POST'
            	      }, function (error, response, body) {
                    	assert(JSON.parse(body)['value'],'Unable to login user');
                    	sessKey = JSON.parse(body)['value'];
                    	done();
            	      });
    		    });
	      	  });
            	});
              });
             }
      	   });
    	 });
	 });
       });
	it('Test: PUT to /api/profile/update with subscriber_id in the body should return msg.notAuthorized()',
	function(done) {
                request( {
                        url: 'http://localhost:3000/api/profile/update',
                        body: '{\"subscriber_id\": \"1\", \"id\": \"2\", \"name\": \"test2profile\"' +
															', \"ofp_version\" : \"10\" }',
                        headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
                        method: 'PUT'
                }, function (error, response, body) {
                        assert.equal(JSON.parse(body)['error']['type'],'notAuthorized');
                        console.log('\tResponse received : ', body);
                        done();
                });
        });
	
	it('Test: PUT to /api/profile/update {id: id, name: name} with an id not in the database should return msg.profileNotFound() ',
        function(done) {
                request( {
                        url: 'http://localhost:3000/api/profile/update',
                        body: '{ \"id\": \"999999999\", \"name\": \"test3profile\",' + 
                              ' \"ofp_version\" : \"10\" }',
                        headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
                        method: 'PUT'
                }, function (error, response, body) {
                        assert.equal(JSON.parse(body)['error']['type'],'profileNotFound');
                        console.log('\tResponse received : ', body);
                        done();
                });
        });

  it('Test: any method but PUT should return msg.methodNotSupported()',
  function(done) {
    request({
      url: 'http://localhost:3000/api/profile/update',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'GET',
      method: 'POST',
      method: 'DELETE'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'methodNotSupported');
      console.log('\tResponse received : ', body);
      done();
    });
  });

});
//-----------------------------------------------------------------------------
//Test list profile
describe('Testing list profile request: ', function(){
  
  it('Test: Successful request of profiles GET /api/profile/list should return {"id":id, "name":name, "ofp_version": a_version}',
  function(done) {
      request({
        url : 'http://localhost:3000/api/profile/list',
        headers: {'Content-Type': 'application/json','x-access-token': sessKey},
        method: 'GET' 
      }, function (error, response, body) {
	console.log(body);
        assert(JSON.parse(body)['value'][0]);
	assert(JSON.parse(body)['value'][0].id);
        assert(JSON.parse(body)['value'][0].name);
        assert(JSON.parse(body)['value'][0].ofp_version);
	done();
    });
  });
  
  it('Test: GET /api/profile/list while not logged in should return msg.subscriberUnauthenticated()',
  function(done) {
    request( { //logout
      url: 'http://localhost:3000/api/subscriber/logout',
      body: '{ \"email\": \"flowgrammablemailer@gmail.com\", \"password\": \"my password\"}',
      headers: {'Content-Type': 'application/json','x-access-token': sessKey},
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to logout user');
      console.log('\tResponse received : ', body);
      request( {
        url: 'http://localhost:3000/api/profile/list',
        body: '{ \"id\": \"1\", \"name\": \"test profile\"}',
        headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
        method: 'PUT'
      }, function (error, response, body) {
        assert.equal(JSON.parse(body)['error']['type'],'subscriberUnauthenticated');
        console.log('\tResponse received : ', body);
        done();
      });
    });
  });

  it('Test: GET /api/profile/list with no profiles found should return msg.noProfilesFound()',
  function(done) {
   /* this.timeout(5000);
    request( { // register subscriber
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"flowgrammabletest2@gmail.com\", \"password\": \"openflow2\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      console.log(body);
      assert(JSON.parse(body)['value'],'Unable to register user');
      fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
        if (err) console.log('Unable to read token in file for restTest');
        else {
          var array = data.toString().split("\n");
          token = JSON.parse(array[0]).ver_token;
          request( { // verify subscriber
            url: 'http://localhost:3000/api/subscriber/verify/',
            body: '{ \"token\": \"'+token+'\"}',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
          }, function (error, response, body) {
            assert(JSON.parse(body)['value'],'Unable to verify user');*/
            request( { // login subscriber
              url: 'http://localhost:3000/api/subscriber/login',
              body: '{ \"email\": \"flowgrammabletest2@gmail.com\", \"password\": \"openflow2\"}',
              headers: { 'Content-Type': 'application/json' },
              method: 'POST'
            }, function (error, response, body) {
              assert(JSON.parse(body)['value'],'Unable to login user');
              sessKey = JSON.parse(body)['value'];
              request( {
                url : 'http://localhost:3000/api/profile/list',
                headers: {'Content-Type': 'application/json','x-access-token': sessKey},
      		method: 'GET'
    	      }, function (error, response, body) {
      		assert(JSON.parse(body)['value'],'noProfilesFound');
      		console.log('\tResponse received : ', body);
      		done();
    	      });
            });/*
          });
        }
      });
    });*/
  });
  it('Test: any method but GET should return msg.methodNotSupported()',
  function(done) {
    request({
      url: 'http://localhost:3000/api/profile/list',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'POST',
      method: 'PUT',
      method: 'DELETE'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'methodNotSupported');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});

