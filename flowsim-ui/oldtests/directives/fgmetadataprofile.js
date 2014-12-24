'use strict';

describe('Directive: fgMetadataProfile', function () {

  // load the directive's module
  beforeEach(module('flowsimUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fg-metadata-profile></fg-metadata-profile>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fgMetadataProfile directive');
  }));
});
