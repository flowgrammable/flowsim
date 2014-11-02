'use strict';

describe('Controller: SimulationCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var SimulationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SimulationCtrl = $controller('SimulationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
