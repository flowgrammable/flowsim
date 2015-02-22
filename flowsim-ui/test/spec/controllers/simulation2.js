'use strict';

describe('Controller: Simulation2Ctrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var Simulation2Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Simulation2Ctrl = $controller('Simulation2Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
