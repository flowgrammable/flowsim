'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgfeaturenotice
 * @description
 * # fgfeaturenotice
 */
angular.module('flowsimUiApp')
  .directive('fgFeatureNotice', function () {
    return {
      template: '<div class="alert alert-info" role="alert" style="padding: 10px;"><strong>Notice!</strong> {{msg}}</div>',
      restrict: 'E',
      replace: true,
      scope: {
      	msg: '@'
      },
      link: function postLink() {
      }
    };
  });
