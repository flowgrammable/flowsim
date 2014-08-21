var utils = require('../controllerUtils.js');
var assert = require('assert');
describe('===> Utils Test: \n', function(){
  var missingNameData = {name: ''};
  var noNameData = {notName: 'test'};
  it('Profile: Test passing a missing name should return msg.missingName()', function(done){
    assert.equal(utils.invalidProfile(missingNameData), true);
    done();
  });
  it('Profile: Test passing data with no "name" field should return msg.missingName()', function(done){
    assert.equal(utils.invalidProfile(noNameData), true);
    done();
  });
});
