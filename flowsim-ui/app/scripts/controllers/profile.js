'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfileCtrl', function ($scope, fgCache, Profile, $rootScope) {

    $scope.names = {};
    $scope.profile = null;

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

    $scope.datapath = {
      id: '01:23:45:67:89:ab',
      ip_reassembly: true,
      n_buffers: 1024,
      n_tables: 256,

      mfr_desc: '',
      hw_desc: '',
      sw_desc: '',
      serial_num: '',
      dp_desc: ''
    };

    $scope.ports = {
      n_ports: 24,
      ports: []
    };

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


    $scope.addProfile = function(name, callback) {
      if(name in $scope.names) {
        callback('Name exists');
      } else if(name.length === 0) {
        callback('Invalid name');
      } else {
        callback(null);
        $scope.profile = fgCache.create('profile', name, Profile);
        console.log($scope.profile);
        $scope.names[name] = true;
        $scope.setDirty();
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

  });
