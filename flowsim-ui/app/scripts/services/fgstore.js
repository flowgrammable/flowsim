'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.fgstore
 * @description
 * # fgstore
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('fgStore', function (fgCache, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

  function get(type){
  	var deferred = $q.defer();

  	fgCache.getNames(type, function(err, result){
			if(err){
				console.log('err:', err);
			} else {
				deferred.resolve(result);
			}
  	});
  	return deferred.promise;
  }

  return {
  	get: get
  };

});
