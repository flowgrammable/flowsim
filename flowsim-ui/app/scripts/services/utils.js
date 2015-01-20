'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.utils
 * @description
 * # utils
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Utils', function(Noproto, Protocols) {

function mkAction(protoName, fieldName, op, value){
	var bitwidth = '';
	if(fieldName !== 'tag'){
		var npField = Protocols.getField(protoName, fieldName);
		bitwidth = npField.bitwidth;
	}
	var actProf = new Noproto.ActionProfile(null, protoName, fieldName, bitwidth,
		null, op, null);
	return actProf.mkType(value);
}


return {
	mkAction: mkAction
};

});
