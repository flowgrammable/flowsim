'use strict';

describe('Controller: ProfileDatapathCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var ProfileDatapathCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfileDatapathCtrl = $controller('ProfileDatapathCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
