'use strict';

ddescribe('Directive: fgList', function () {

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

  it('list add item', function () {
    dscope = element.isolateScope();
    dscope.itemName = 'a';
    expect(dscope.itemName).toBe('a');
    element.find('form').submit();
    expect(element.find('tr').length).toBe(1);
    expect(dscope.focus).toBe(0);
  });

  it('list add item shift focus', function () {
    expect(element.find('tr').length).toBe(0);
    dscope = element.isolateScope();
    dscope.itemName = 'a';
    element.find('form').submit();
    
    dscope.itemName = 'b';
    element.find('form').submit();
    expect(element.find('tr').length).toBe(2);
    expect(dscope.focus).toBe(1);
  });

  it('list item shift focus', function() {
    dscope = element.isolateScope();
    dscope.itemName = 'a';
    element.find('form').submit();
    dscope.itemName = 'b';
    element.find('form').submit();
  })



});
