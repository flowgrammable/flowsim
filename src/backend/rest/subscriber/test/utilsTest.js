//utils Test
var utils = require('../controllerUtils.js')

//email tests
//invalid email returns false
//var badEmail = "ojh12345@gmail"
//if(utils.verifyEmail(badEmail)==false){
//    console.log('Test Passed')
//}
//else{
//    console.log('Test failed')
//}
assert.equal(utils.validEmail(badEmail), false, ['invalid email'])
