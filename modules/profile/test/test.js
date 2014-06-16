var request = require('request');
var assert = require('assert');

var testEmail = 'ash.1382@gmail.com';
describe('Testing client requests:',function() {
  it('User registered successfully',function(done) {
    request( {
      url: 'http://localhost:8000/subscribers',
      body: '{ \"email\": \"'+testEmail+'\", \"password1\": \"my password\"' +
      ', \"password2\":\"my password\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,201);
      console.log('\tResponse received : ', body);
      done();
    });
  });

  it('Subscriber created profile sucessfully', function(done){
		request( {
			url: 'http://localhost:8000/profile',
			body: '{ \"sub_id\": \"1\", \"profile_name\":\"test_profile\",' + // switch_profile table
            '\"vp_any\" : true, \"vp_local\":true, ' + // datapath_caps table
						'\"vp_normal\":true, \"vp_flood\":true,' +
						'\"ofpxmt_ofb_in_port\": true, \"ofpxmt_ofb_in_phy_port\":true, ' + // match_caps table
						'\"ofpxmt_ofb_eth_dst\": true, \"ofpxmt_ofb_src_dst\":true, ' +
						'\"ofpxmt_ofb_eth_type\": true , ' +
            '\"ofpat_output\":true, \"ofpat_set_field_eth_dst\":true, ' + // action_caps table
						'\"ofpat_set_field_eth_src\":true}',
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		}, function(error, response, body) {
				console.log('\n\tStatus : '+ response.statusCode);
				assert.equal(response.statusCode, 201);
				console.log('\tResponse recieved : ', body);
				done();
		
		});  
  });
});
