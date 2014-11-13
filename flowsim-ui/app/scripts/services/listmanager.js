'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.ListManager
 * @description
 * # ListManager
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('ListManager', function(Regex) {

  console.log('listmanager');

  this.names = {};
  this.errorMsg = '';
  
  this.add = function(callback) {
    var that = this;
    return function(name, _callback) {
      if(!Regex.Identifier.test(name)) {
        _callback('Invalid Identifier');
      } else if(name in that.names) {
        _callback('Identifier Exists');
      } else {
        that.names[name] = true;
        callback(name, _callback);
      }
    };
  };

  this.del = function(callback) {
    var that = this;
    return function(name) {
      callback(name);
      delete that.names[name];
    };
  };

  this.set = function(callback) {
    return function(name) {
      if(_.isString(name) && name.length > 0) {
        callback(name);
      }
    };
  };
  
});
