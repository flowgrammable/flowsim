'use strict';

describe('Controller: PacketCtrl', function () {

  // load the controller's module
  beforeEach(module('flowsimUiApp'));

  var PacketCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PacketCtrl = $controller('PacketCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
