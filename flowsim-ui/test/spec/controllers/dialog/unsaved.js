'use strict';

describe('Controller: DialogUnsavedCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var DialogUnsavedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogUnsavedCtrl = $controller('DialogUnsavedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
