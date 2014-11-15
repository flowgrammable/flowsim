'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgPacketCtx
 * @description
 * # fgPacketCtx
 */
angular.module('flowsimUiApp')
  .directive('fgPacketCtx', function () {
    return {
       templateUrl: 'views/simulation/fgpacketctx.html',
            replace: true,
            scope: {
                view: '='
            },
      restrict: 'E'
    };
  });
