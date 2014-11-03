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
        stack: '=',
        options: '=',
        //getOptions: '&',    // callback for node construction tree
        createNode: '&',    // callback for creating a node
        popNode:    '&',
        setDirty: '&'      // callback for persisting changes
      },
      controller: function($scope) {
        $scope.loaded = false;
        $scope.prev_len = 0;
        //$scope.stack    = [];
        $scope.nodeType = '';  // input type to create node
        //$scope.options  = [];  // input select options
        var val = 0;
        // Update the current display
        /*
        $scope.$on('setStack', function(ev, data) {
          var name;
          if(data) {
            $scope.stack = data;
            name = $scope.stack.length ?
                      $scope.stack[$scope.stack.length-1].name
                      : '';
            $scope.options = $scope.getOptions()(name);
          }
        });
        */

        // Add a new Node type to the back of the stack
       $scope.addNode = function() {
         var node, name;
         if($scope.nodeType.length) {
           $scope.createNode()($scope.nodeType);
           $scope.nodeType = '';
           /*
           name = $scope.stack.length ? $scope.stack[$scope.stack.length-1].name
                                      : '';
           $scope.options = $scope.getOptions()(name);
           */
         }
       };

      // Delete the node from the top of the stack
      $scope.delNode = function() {
        /*
        var name;
        if($scope.stack.length) {
          $scope.stack.pop();
          name = $scope.stack.length ? $scope.stack[$scope.stack.length-1].name
                                    : '';
          $scope.options = $scope.getOptions()(name);
        }
        */
        $scope.popNode()();
      };

      $scope.getPayloadBytes = function() {
        if($scope.stack.slice(-1)[0].name === 'Payload'){
          val = parseInt($scope.stack.slice(-1)[0].attrs[0].value);
          if(isNaN(val)){
            $scope.stack.slice(-1)[0].bytes = 0;
          } else {
            $scope.stack.slice(-1)[0].bytes = val;
          }
        }
      }

      $scope.$watch('stack', function() {
        if($scope.loaded) {   // <-- why not just use '$scope.stack' here?
          // A: first time stack watch is triggered... stack is undefined
          //      stack is defined on 2nd trigger
          $scope.setDirty()();
          $scope.getPayloadBytes();
          //if($scope.stack.slice(-1)[0].name === 'Payload'){   // <-- what if the stack is empty
            // this needs to be moved into a self contained function ... $scope.getPayloadBytes()
            // then it will be obvious later what is happening
            /*  val = parseInt($scope.stack.slice(-1)[0].attrs[0].value);
              if(isNaN(val)){
                $scope.stack.slice(-1)[0].bytes = 0;
              } else {
                $scope.stack.slice(-1)[0].bytes = val;
              }*/

        }
        if($scope.stack){
          $scope.loaded = true;
          console.log('loaded is true');
        }
      }, true);

      }
    };
  });
