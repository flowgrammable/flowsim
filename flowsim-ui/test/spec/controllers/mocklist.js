'use strict';

describe('Controller: MocklistCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var MocklistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MocklistCtrl = $controller('MocklistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
