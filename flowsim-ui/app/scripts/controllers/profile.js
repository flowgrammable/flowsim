'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfileCtrl', function ($scope, fgCache, Profile) {

    $scope.names = {};
    $scope.profile = null;
    $scope.focus = 'datapath';
    $scope.dirty = false;

    $scope.set = function(idx) {
      Profile.setVersion($scope.profile, idx);
    };

    $scope.activeVer = 0;
    $scope.versions = [
      'OpenFlow 1.0',
      'OpenFlow 1.1',
      'OpenFlow 1.2',
      'OpenFlow 1.3',
      'OpenFlow 1.4'
    ];

    $scope.activeProto = 0;
    $scope.protocols = [{
      name: 'Internal',
      attrs: [{
        name: 'In Port',
        type: 'checkbox',
        value: true,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Mask',
        type: 'text',
        value: 0,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Metadata',
        type: 'checkbox',
        value: true,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Mask',
        type: 'text',
        value: 0,
        test: function() { return true; },
        tip: ''
      }]
    }, {
      name: 'Ethernet',
      attrs: [{
        name: 'Src',
        type: 'checkbox',
        value: true,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Mask',
        type: 'text',
        value: 0,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Dst',
        type: 'checkbox',
        value: true,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Mask',
        type: 'text',
        value: 0,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Typelen',
        type: 'checkbox',
        value: true,
        test: function() { return true; },
        tip: ''
      }, {
        name: 'Mask',
        type: 'text',
        value: 0,
        test: function() { return true; },
        tip: ''
      }]
    }, {
      name: 'VLAN',
      attrs: [{
      }]
    }, {
      name: 'ARP',
      attrs: [{
      }]
    }, {
      name: 'MPLS',
      attrs: [{
      }]
    }, {
      name: 'IPv4',
      attrs: [{
      }]
    }, {
      name: 'IPv6',
      attrs: [{
      }]
    }, {
      name: 'ICMPv4',
      attrs: [{
      }]
    }, {
      name: 'ICMPv6',
      attrs: [{
      }]
    }, {
      name: 'TCP',
      attrs: [{
      }]
    }, {
      name: 'UDP',
      attrs: [{
      }]
    }, {
      name: 'SCTP',
      attrs: [{
      }]
    }];

    $scope.showProto = function(idx) {
      $scope.activeProto = idx;
    };

    $scope.getProfiles = function(callback) {
      fgCache.getNames('profile', callback);
    };


    $scope.addProfile = function(name) {
      if(name in $scope.names) {
        return 'Name exists';
      } else if(name.length == 0) {
        return 'Invalid name';
      } else {
        $scope.profile = fgCache.create('profile', name, Profile).ui;
        $scope.names[name] = true;
        $scope.dirty = true;
        return '';
      }
    };

    $scope.delProfile = function(name) {
      fgCache.destroy('profile', name);
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
            $scope.profile = result.ui;
            $scope.$broadcast('setProfile', $scope.profile);
          }
        });
      }
    };

    $scope.save = function() {
      fgCache.save(function(err, result) {
        if(err) {
          $scope.dirty = true;
          console.log(err.details)
        } else {
          scope.dirty = false;
        }
      });
    };

  });
