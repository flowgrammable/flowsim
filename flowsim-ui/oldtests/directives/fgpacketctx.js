'use strict';

describe('Directive: fgPacketCtx', function () {

  // load the directive's module
  beforeEach(module('flowsimUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fg-packet-ctx></fg-packet-ctx>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fgPacketCtx directive');
  }));
});
