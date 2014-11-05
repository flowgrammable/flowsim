'use strict';

describe('Controller: SwitchCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var SwitchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SwitchCtrl = $controller('SwitchCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
  });
});
