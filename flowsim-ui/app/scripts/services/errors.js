'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.errors
 * @description
 * # errors
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Errors', function () {
function missingProtocol(protoName){
	return 'Packet does not contain: ' + protoName;
}

function missingField(protoName, fieldName){
	return protoName + ' does not contain ' + fieldName;
}

return {
	missingProtocol: missingProtocol,
	missingField: missingField
};

});
