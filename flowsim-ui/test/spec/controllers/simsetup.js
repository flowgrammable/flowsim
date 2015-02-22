'use strict';

describe('Controller: SimsetupCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var SimsetupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SimsetupCtrl = $controller('SimsetupCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
