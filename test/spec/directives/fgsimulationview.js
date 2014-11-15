'use strict';

describe('Directive: fgsimulationview', function () {

  // load the directive's module
  beforeEach(module('flowsimApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fgsimulationview></fgsimulationview>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fgsimulationview directive');
  }));
});
