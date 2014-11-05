'use strict';

describe('Controller: DialogSwitchCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var DialogSwitchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $modalInstance) {
    scope = $rootScope.$new();
    DialogSwitchCtrl = $controller('DialogSwitchCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
