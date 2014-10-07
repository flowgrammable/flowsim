'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Subscriber
 * @description
 * # Subscriber
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Subscriber', function Subscriber() {

    var validEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validPassword = /[a-zA-Z0-9_]{8,}/;

    this.validateEmail = function(email) {
      if(!validEmail.test(email)) {
        return 'Invalid email';
      } else {
        return '';
      }
    };

    this.validatePassword = function(password) {
      if(!validPassword.test(password)) {
        return 'Invalid password';
      } else {
        return '';
      }
    };
  });
