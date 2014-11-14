'use strict';

describe('Controller: SwitchTableCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var SwitchTableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SwitchTableCtrl = $controller('SwitchTableCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
