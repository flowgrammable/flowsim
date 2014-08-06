var utils = require('../controllerUtils.js');
var assert = require('assert');
describe('===> Utils Test: \n', function(){
	var badData = {name: ''};
	var noNameData = {notName: 'test'};
	it('Packet: Test passing invalid name should return true', function(done){
		assert.equal(utils.invalidPacket(badData), true);
		done();
	});
	it('Packet: Test passing data with no "name" field should return true', function(done){
		assert.equal(utils.invalidPacket(noNameData), true);
		done();
	});
});
