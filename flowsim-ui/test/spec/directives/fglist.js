'use strict';

describe('Directive: fgList', function () {

  // load the directive's module
  beforeEach(function(){
    module('flowsimUiApp');
    module('my.templates');
  });
  var element,
    scope, controller, dscope;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller('mockListCtrl', {
      $scope: scope
    });
  }));

  beforeEach(inject(function($compile){
    scope.$apply(function(){
      element = angular.element('<fg-list '+
      'on-init="mockGet" on-set="mockSet" ' +
      'on-add="mockAdd" on-del="mockDel"></fg-list>');
      element = $compile(element)(scope);
    });
  }));

  it('list init',function () {
    expect(element.find('tr').length).toBe(0);
  });

  it('list item shift focus', function() {
    dscope = element.isolateScope();
    dscope.itemName = 'a';
    element.find('form').submit();
    dscope.itemName = 'b';
    element.find('form').submit();
  })



});
