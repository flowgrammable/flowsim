//utils Test
var utils = require('../controllerUtils.js')

//email tests
//invalid email returns false
var badEmail = "ojh12345@gmail"
return utils.verifyEmail(badEmail)
