
(function(){

var fgStack = function() {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'widgets/stack.html',
    scope: {
      getOptions: '&',    // used to retreive an option tree
      createNode: '&',    // used to extend a type constructor
      saveStack: '&'           // used to signal a data persist
    },
    controller: function($scope, $rootScope) {
     
      $scope.stack = [];          // stack of items to present
      $scope.prevStack = null;    //
      $scope.stackDirty = false;  // track the persistent state of the stack
      $scope.nodeType = '';       // select input box value
      $scope.options = [];        // select options to present

      // initialize our decision tree from directive attrs
      $scope.optionTree = $scope.getOptions()();

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
      
      // Update the current display
      $scope.$on('change', function(ev, data) {
        $scope.prevStack = data;
        $scope.stack = data;
        $scope.stackDirty = false;
      });
    }
  };
};

var fgWidgets = angular.module('fgWidgets');
fgWidgets.directive('fgStack', fgStack);

})();
