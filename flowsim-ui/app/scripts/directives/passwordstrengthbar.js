/**
 * Created by sasha on 2/16/15.
 */
/* globals $ */
'use strict';

angular.module('flowsimUiApp')
  .directive('passwordStrengthBar', function (PasswordStrength) {
    return {
      replace: true,
      restrict: 'E',
      template: '<div id="strength"><br>' +
      '<label>Password strength:</label>' +
      '<ul id="strengthBar">' +
      '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
      '</ul>' +
      '</div>',
      link: function (scope, iElement, attr) {
        var strength = {
          colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
          getColor: function (s) {

            var idx = 0;
            if (s <= 10) {
              idx = 0;
            }
            else if (s <= 20) {
              idx = 1;
            }
            else if (s <= 30) {
              idx = 2;
            }
            else if (s <= 40) {
              idx = 3;
            }
            else {
              idx = 4;
            }

            return { idx: idx + 1, col: this.colors[idx] };
          }
        };
        scope.$watch(attr.passwordToCheck, function (password) {
          if (password) {
            var c = strength.getColor(PasswordStrength.mesureStrength(password));
            iElement.removeClass('ng-hide');
            iElement.find('ul').children('li')
              .css({ 'background': '#DDD' })
              .slice(0, c.idx)
              .css({ 'background': c.col });
          }
        });
      }
    };
  });
