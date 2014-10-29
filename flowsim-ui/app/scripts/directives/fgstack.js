'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgStack
 * @description
 * # fgStack
 */
angular.module('flowsimUiApp')
  .directive('fgStack', function () {

    return {
      restrict: 'E',                      // HTML Element
      transclude: true,                   // Copy element body in
      templateUrl: 'views/fgstack.html',  // Location of template
      scope: {
        getOptions: '&',    // callback for node construction tree
        createNode: '&',    // callback for creating a node
        setDirty: '&'      // callback for persisting changes
      }, controller: function($scope) {

        $scope.stack    = [];
        $scope.nodeType = '';  // input type to create node
        $scope.options  = [];  // input select options

        // Update the current display
        $scope.$on('setStack', function(ev, data) {
          var name;
          console.log('current setstack,', data);
          $scope.stack = data;
          if(data) {
            name = $scope.stack.length ? 
                      $scope.stack[$scope.stack.length-1].name
                      : '';
           console.log('yo: ' + name);
            console.log('zo: ' + $scope.getOptions()(name));
            $scope.options = $scope.getOptions()(name);
          }
        });

        // Add a new Node type to the back of the stack
       $scope.addNode = function() {
         var node, name;
         if($scope.nodeType.length) {
           node = $scope.createNode()($scope.nodeType);
           $scope.stack.push(node);
           $scope.nodeType = '';
           name = $scope.stack.length ? $scope.stack[$scope.stack.length-1].name
                                      : '';
           console.log('yo: ' + name);
           console.log('zo: ' + $scope.getOptions()(name));
           $scope.options = $scope.getOptions()(name);
         }
       };

       // Delete the node from the top of the stack
       $scope.delNode = function() {
         var name;
         $scope.stack.pop();
         name = $scope.stack.length ? $scope.stack[$scope.stack.length-1].name 
                                    : '';
         $scope.options = $scope.getOptions()(name);
       };

      $scope.$watch('stack', function() {
        if($scope.stack && $scope.stack.length) {
          $scope.setDirty()();
        }
      }, true);

      }
    };
  });
