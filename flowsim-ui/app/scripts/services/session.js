'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.session
 * @description
 * # session
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Session', function ($window) {
 
  this.storeToken = function(token){
  	$window.sessionStorage.setItem('Token', token);
  };

  this.destroy = function(){
  	if($window.sessionStorage.Token){
  		$window.sessionStorage.removeItem('Token');
  	}
  };

  this.isActive = function(){
  	if(_.isUndefined($window.sessionStorage.Token)){
  		return false;
  	} else {
  		return true;
  	}
  };

  this.token = function(){
  	if(this.isActive()){
  		return $window.sessionStorage.getItem('Token');
  	} else {
  		return '';
  	}
  };

});
