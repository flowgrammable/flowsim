'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.utils
 * @description
 * # utils
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Utils', function(Protocols, Noproto) {

function mkAction(protoName, fieldName, op, value){
	var npField = Protocols.getField(protoName, fieldName);
	var actProf = new Noproto.ActionProfile(null, protoName, fieldName, npField.bitwidth,
		null, op, null);
	return actProf.mkType(value);
}

return {
	mkAction: mkAction
};

});
