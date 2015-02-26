'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgApplyAction
 * @description
 * # fgApplyAction
 */
angular.module('flowsimUiApp')
  .directive('fgApplyActions', function (Protocols) {
    return {
      templateUrl: 'views/fgApplyAction.html',
      restrict: 'E',
      scope: {
        toplevel: '=',
        match:    '=',
        actions:  '='
      },
      controller: function($scope) {

        // Input selectors and box
        $scope.active = {
          protocols: [],
          fields:    [],
          ops:       [],
          protocol:  '',
          field:     '',
          op:        '',
          value:     '',
          type:      null
        };
        var defSafe = new Protocols.ActionProfiles();
        defSafe = defSafe.defSafe();
        // Build a top-level list of enabled actions
        $scope.enabledProfiles = _($scope.toplevel).filter(function(profile) {
          return profile.enabled;
        });

        // Filter out all protocols that are not present in match
        $scope.updateProfiles = function() {
          $scope.availableProfiles= _($scope.enabledProfiles).filter(
            function(profile) {
                return (profile.protocol === 'Internal') ||
                (profile.protocol === 'Ethernet') ||
                (profile.op === 'push') || 
                _($scope.match).some(function(_match) {
                       var candidate = Protocols.Graph(_match.protocol, 
                                                       _match.field, 
                                                       _match.value);
                       return candidate === profile.protocol;
                    });
            });
        };
        $scope.updateProfiles();

        // Build a top-level list of avaiable apply action names
        $scope.updateProtocols = function() {
          $scope.active.protocols = _(_($scope.availableProfiles).map(
            function(profile) {   return profile.protocol;
            })).unique();
        };
        $scope.updateProtocols();
        

        $scope.updateActiveActions = function(){
          $scope.actions = _($scope.actions).filter(function(action){
            return _($scope.active.protocols).some(function(proto){
              return proto === action.protocol;
            });
          }); 
          $scope.actions = _($scope.actions).filter(function(act){
            return _($scope.match).some(function(_mat){
              var cand = Protocols.Graph(_mat.protocol,
                                         _mat.field,
                                         _mat.value);
              return cand === act.protocol;
            }) || _(defSafe).some(function(sact){
              return sact.field === act.field && sact.op === act.op;
            });
          }); 
        };
        $scope.updateActiveActions();

        // Re-run on changes to the underlying match set ... new protocols may
        // be available upon more matches
        $scope.$watch('match', function() { 
          $scope.updateProfiles(); 
          $scope.updateProtocols();
          $scope.updateActiveActions();
          $scope.updateProtocol();
          $scope.updateField();
          $scope.updateOp();
        }, true);

        // Update the depdendent drop boxes
        $scope.updateProtocol = function() {
          $scope.activeFields = _($scope.availableProfiles).filter(
            function(profile) {
              return profile.protocol === $scope.active.protocol;
            });
            
          $scope.active.fields = _(_($scope.activeFields).map(
            function(profile) {
              return profile.field;
            })).unique();

          $scope.active.type    = null;
          $scope.active.value   = '';
          $scope.active.op      = '';
          $scope.active.field   = '';
          $scope.active.actions = [];
        };

        // Update the depdendent drop boxes
        $scope.updateField = function() {
          $scope.activeOps = _($scope.activeFields).filter(
            function(profile) {
              return profile.field === $scope.active.field;
            });
          $scope.active.ops = _($scope.activeOps).map(
            function(profile) {
              return profile.op;
            });

          $scope.active.type   = null;
          $scope.active.value  = '';
          $scope.active.op     = '';
        };

        // Update the depdendent drop boxes
        $scope.updateOp = function() {
          $scope.active.type = _($scope.activeOps).find(
            function(profile) {
              return profile.op === $scope.active.op;
            });
          $scope.active.value = '';  
        };

        // Remove the last action
        $scope.popAction = function() {
          if($scope.actions.length > 0) {
            $scope.actions.splice(-1, 1);
         
            // Flush the inputs on modification
            $scope.active.type     = null;
            $scope.active.value    = '';
            $scope.active.op       = '';
            $scope.active.field    = '';
            $scope.active.protocol = '';
            $scope.active.fields   = [];
            $scope.active.ops      = [];
          }
        };

        // Add the action ... invoke the callback
        $scope.addAction = function() {
          var action;
          if($scope.active.op === 'set' && 
            !$scope.active.type.valueTest($scope.active.value)){
            throw 'Add apply action failed: '+$scope.active.value;
          }

          // Construct the aciton type and add to the list
          action = $scope.active.type.mkType($scope.active.value);
          $scope.actions.push(action);
        
          // Clearn the selectors and inputs
          $scope.active.type     = null;
          $scope.active.value    = '';
          $scope.active.op       = '';
          $scope.active.field    = '';
          $scope.active.protocol = '';
          $scope.active.fields   = [];
          $scope.active.ops      = [];
        };

      }
    };
  });

