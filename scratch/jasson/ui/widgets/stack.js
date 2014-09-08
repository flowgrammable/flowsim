
(function(){

var fgStack = function() {
  return {
    restrict: 'E',                      // HTML Element
    transclude: true,                   // Copy element body in
    templateUrl: 'widgets/stack.html',  // Location of template
    scope: {
      getOptions: '&',    // callback for node construction tree
      createNode: '&',    // callback for creating a node
      saveStack: '&'      // callback for persisting changes
    },
    controller: function($scope, $rootScope) {

      $scope.unsaved = false;     // save state of current stack
      $scope.nodeType = '';       // input type to create node
      $scope.options = [];        // input select options
      
      // Update the current display
      $scope.$on('setStack', function(ev, data) {
        $scope.stack = data;
        $scope.stackDirty = false;
      });

      // Add a new Node type to the back of the stack
      $scope.addNode = function() {
        var node;
        if($scope.nodeType.length > 0) {
          node = $scope.createNode($scope.nodeType);
          $scope.stack.push(node); 
          $scope.stackDirty = true;
          $scope.nodeType = '';
          $scope.options = $scope.optionTree[node.name];
        }
      };

      // Delete the node from the top of the stack
      $scope.delNode = function(pos) {
        var lastName;
        $scope.stack.pop();
        lastName = $scope.stack[$scope.stack.length-1].name;
        $scope.options = $scope.optionTree[lastName];
        $scope.stackDirty = true;
      };
    
      // Save our current changes
      $scope.save = function() {
        if($scope.stackDirty) {
          $scope.save()();
          $scope.prevStack = null;
          $scope.stackDirty = false;
        }
      };

      // Cancel our existing changes
      $scope.revert = function() {
        if($scope.stackDirty) {
          $scope.stack = $scope.prevStack;
          $scope.stackDirty = false;
        }
      };
      
    }
  };
};

var fgWidgets = angular.module('fgWidgets');
fgWidgets.directive('fgStack', fgStack);

})();
