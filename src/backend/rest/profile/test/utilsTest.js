var utils = require('../controllerUtils.js');
var assert = require('assert');
describe('===> Utils Test: \n', function(){
	var badData = {name: ''};
	var noNameData = {notName: 'test'};
	it('Profile: Test passing invalid name should return true', function(done){
                assert.equal(utils.invalidProfile(badData), true);
                done();
        });
        it('Profile: Test passing data with no "name" field should return true', function(done){
                assert.equal(utils.invalidProfile(noNameData), true);
                done();
        });
});
