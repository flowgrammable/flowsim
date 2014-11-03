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

    var loaded = false;             // <- what is the purpose of this variable
    var prev = false;               // <- what is the purpose of this variable
    $scope.tips = Profile.TIPS;
    $scope.tests = Profile.TESTS;
    $scope.mediums = Profile.MEDIUMS;
    $scope.modes = Profile.MODES;
    $scope.speeds = Profile.SPEEDS;

    $scope.versions = [
      'OpenFlow 1.0',
      'OpenFlow 1.1',
      'OpenFlow 1.2',
      'OpenFlow 1.3',
      'OpenFlow 1.4'
    ];

    $scope.preselectVersion = function(idx) {
      switch(idx) {
        case 0:
          $scope.profile = Profile.openflow_1_0($scope.profile);
          break;
        case 1:
          $scope.profile = Profile.openflow_1_1($scope.profile);
          break;
        case 2:
          $scope.profile = Profile.openflow_1_2($scope.profile);
          break;
        case 3:
          $scope.profile = Profile.openflow_1_3($scope.profile);
          break;
        case 4:
          $scope.profile = Profile.openflow_1_4($scope.profile);
          break;
        default:
          break;
      }
    }

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

    $scope.delProfile = function(name) {
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
          tips: function() { return $scope.tips.match; },
          tests: function() { return $scope.tests.match; },
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
          tips: function() { return $scope.tips.instruction; },
          tests: function() { return $scope.tests.instruction; },
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
          tips: function() { return $scope.tips.instruction; },
          tests: function() { return $scope.tests.instruction; },
          instruction: function() {
            return $scope.profile.tables.tables[idx].miss;
          }
        }
      }).result.then(function(miss) {
         $scope.profile.tables.tables[idx].miss = miss;
      });
    }

    $scope.$watch('profile', function(newValue, oldValue){
      if($scope.profile && !newValue.dirty && oldValue && !oldValue.dirty){
        $scope.profile.dirty = true;
        $scope.setDirty();
      }
    },true);

  });
