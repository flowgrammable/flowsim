'use strict';

describe('Controller: SwitchMetersCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var SwitchMetersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SwitchMetersCtrl = $controller('SwitchMetersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
