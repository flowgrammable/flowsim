'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.PasswordStrength
 * @description
 * # PasswordStrength
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('PasswordStrength', function () {
    this.mesureStrength = function(p) {

      var _force = 0;
      var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

      var _lowerLetters = /[a-z]+/.test(p);
      var _upperLetters = /[A-Z]+/.test(p);
      var _numbers = /[0-9]+/.test(p);
      var _symbols = _regex.test(p);

      var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
      var _passedMatches = $.grep(_flags, function (el) {
        return el === true;
      }).length;

      _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
      _force += _passedMatches * 10;

      // penality (short password)
      _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

      // penality (poor variety of characters)
      _force = (_passedMatches === 1) ? Math.min(_force, 10) : _force;
      _force = (_passedMatches === 2) ? Math.min(_force, 20) : _force;
      _force = (_passedMatches === 3) ? Math.min(_force, 40) : _force;

      return _force;

    }
    this.validatePassword = function(password) {
      return this.mesureStrength(password)>10;
    }
  });
