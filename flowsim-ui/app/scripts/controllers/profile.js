'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfileCtrl', function($scope, fgCache, Profile, $rootScope,
                                      $modal) {

    $scope.names = {};
    $scope.profile = null;

    $scope.metadata = {
      tips:  Profile.TIPS,
      tests: Profile.TESTS,
      ranges: Profile.RANGES
    };

    console.log($scope.metadata.tips.Tables);

    $scope.versions = [
      'OpenFlow 1.0',
      'OpenFlow 1.1',
      'OpenFlow 1.2',
      'OpenFlow 1.3',
      'OpenFlow 1.4'
    ];

    $scope.ceilOpenFlow = function(idx) {
      if(idx === 0) {
        $scope.profile.ofp_1_0();
      } else if(idx ===1) {
        $scope.profile.ofp_1_1();
      } else if(idx ===2) {
        $scope.profile.ofp_1_2();
      } else if(idx ===3) {
        $scope.profile.ofp_1_3();
      } else if(idx ===4) {
        $scope.profile.ofp_1_4();
      }
    };

    $scope.showProto = function(idx) {
      $scope.activeProto = idx;
    };

    $scope.getProfiles = function(callback) {
      fgCache.getNames('profile', callback);
    };


    $scope.addProfile = function(name, callback) {
      if(name in $scope.names) {
        callback('Name exists');
      } else if(name.length === 0) {
        callback('Invalid name');
      } else if(!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        callback('Invalid name');
      } else {
        $scope.profile = fgCache.create('profile', name, Profile);
        $scope.names[name] = true;
        $scope.setDirty();
        callback(null);
      }
    };

    $scope.delProfile = function(name, callback) {
      fgCache.destroy('profile', name);
      if(fgCache.isDirty()) {
        $scope.setDirty();
        $scope.names[name] = true;
        $scope.setDirty();
        callback(null);
      }
    };

    $scope.delProfile = function(name) {
      fgCache.destroy('profile', name);
      if(fgCache.isDirty()) {
        $scope.setDirty();
      } else {
        $scope.setClean();
      }
      delete $scope.names[name];
    };

    $scope.setProfile = function(name) {
      if(name === undefined) {
        $scope.profile = null;
        $scope.$broadcast('setProfile', null);
      } else {
        fgCache.get('profile', name, Profile, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.profile = result;
            $scope.$broadcast('setProfile', $scope.profile);
          }
        });
      }
    };

    $scope.setDirty = function() {
      $rootScope.$broadcast('dirtyCache');
    };

    $scope.setClean = function() {
      $rootScope.$broadcast('cleanCache');
    };

    $scope.match = function(idx) {
      $modal.open({
        templateUrl: 'views/dialog/profile/match.html',
        controller: 'DialogProfileMatchCtrl',
        size: 'lg',
        resolve: {
          tips: function() { return $scope.metadata.tips.Tables.Table.Match; },
          tests: function() { return $scope.metadata.tests.Tables.Table.Match; },
          match: function () {
            return $scope.profile.tables.tables[idx].match;
          }
        }
      }).result.then(function (match) {
         $scope.profile.tables.tables[idx].match = match;
      });
    };

    $scope.instruction = function(idx) {
      $modal.open({
        templateUrl: 'views/dialog/profile/instruction.html',
        controller: 'DialogProfileInstructionCtrl',
        size: 'lg',
        resolve: {
          name: function() { return 'Instruction'; },
          tips: function() { return $scope.metadata.tips.Tables.Table.Instruction; },
          tests: function() { return $scope.metadata.tests.Tables.Table.Instruction; },
          instruction: function () {
            return $scope.profile.tables.tables[idx].instruction;
          }
        }
      }).result.then(function (instruction) {
         $scope.profile.tables.tables[idx].instruction = instruction;
      });
    };

    $scope.miss = function(idx) {
      $modal.open({
        templateUrl: 'views/dialog/profile/instruction.html',
        controller: 'DialogProfileInstructionCtrl',
        size: 'lg',
        resolve: {
          name: function() { return 'Miss'; },
          tips: function() { return $scope.metadata.tips.Tables.Table.Miss; },
          tests: function() { return $scope.metadata.tests.Tables.Table.Miss; },
          instruction: function() {
            return $scope.profile.tables.tables[idx].miss;
          }
        }
      }).result.then(function(miss) {
         $scope.profile.tables.tables[idx].miss = miss;
      });
    };

    $scope.$watch('profile', function(newValue, oldValue){

      if($scope.profile){ // watch for change if profile is loaded
        if($scope.profile.dirty){
          $scope.setDirty();
        } else if(oldValue && !oldValue.dirty) { // if old value was clean, then set dirty
          $scope.profile.dirty = true;
        }
      }
    },true);

  });
