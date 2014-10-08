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
        saveStack: '&'      // callback for persisting changes
      }, controller: function($scope, $rootScope) {
                
        $scope.stack    = [];
        $scope.nodeType = '';  // input type to create node
        $scope.options  = [];  // input select options

        // Update the current display
        $scope.$on('setStack', function(ev, data) {
          $scope.stack = data;
          $scope.options = $scope.getOptions()(data);
        });

        // Add a new Node type to the back of the stack
       $scope.addNode = function() {
         var node;
         if($scope.nodeType.length > 0) {
           node = $scope.createNode($scope.nodeType);
           $scope.stack.push(node); 
           $scope.nodeType = '';
           $scope.options = $scope.getOptions($scope.stack); 
         }
       };

       // Delete the node from the top of the stack
       $scope.delNode = function(pos) {
         var lastName;
         $scope.stack.pop();
         $scope.options = $scope.getOptions($scope.stack); 
       };

      }
    };
  });

