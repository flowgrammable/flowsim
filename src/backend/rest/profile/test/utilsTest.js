var utils = require('../controllerUtils.js');
var msg = require('../msg.js');
var assert = require('assert');
describe('===> Utils Test: \n', function(){
  var missingNameData = {name: '', ofp_version: '10'};
  var noNameData = {notName: 'test', ofp_version: '11'};
  var missingVersionData = {name: 'test'};
  var invalidVersionData = {name: 'test', ofp_version: '20'};

  it('Profile: Test passing a missing name should return msg.missingName()', function(done){
    assert.equal(utils.invalidProfile(missingNameData).error.type, 'missingName');
    done();
  });
  it('Profile: Test passing data with no "name" field should return msg.missingName()', function(done){
    assert.equal(utils.invalidProfile(missingNameData).error.type, 'missingName');
    done();
  });
  it('Profile: Test passing an invalid ofp_version should return msg.invalidOfpVersion()', function(done){
    assert.equal(utils.invalidProfile(invalidVersionData).error.type, 'invalidOfpVersion');
    done();
  });
  it('Profile: Test passing data with no "ofp_version" field should return msg.missingOfpVersion()', function(done){
    assert.equal(utils.invalidProfile(missingVersionData).error.type, 'missingOfpVersion');
    done();
  });

});

