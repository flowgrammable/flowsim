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

function goToBackwards(currTbl, tgtTbl){
	return 'Cannot transition backwards from table' +
		currTbl + ' to ' + tgtTbl;
}

function goToRange(currTbl, tgtTbl){
	return 'Table '+ currTbl+ ' does not support ' +
	'transitioning to table ' + tgtTbl;
}

function goToNoTable(tgtTbl){
	return 'Table with ID: '+tgtTbl+' does not exist';
}

return {
	missingProtocol: missingProtocol,
	missingField: missingField,
	goToBackwards: goToBackwards,
	goToRange: goToRange,
	goToNoTable: goToNoTable
};

});
