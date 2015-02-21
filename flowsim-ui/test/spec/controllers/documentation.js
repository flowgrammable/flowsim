'use strict';

describe('Controller: DocumentationCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var DocumentationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocumentationCtrl = $controller('DocumentationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
  });
});
