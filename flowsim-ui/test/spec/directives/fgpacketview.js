'use strict';

describe('Directive: fgPacketView', function () {

  // load the directive's module
  beforeEach(module('flowsimUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fg-packet-view></fg-packet-view>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the fgPacketView directive');
  }));
});
