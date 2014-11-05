'use strict';

describe('Controller: DialogProfileInstructionCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var DialogProfileInstructionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $modalInstance) {
    scope = $rootScope.$new();
    DialogProfileInstructionCtrl = $controller('DialogProfileInstructionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
