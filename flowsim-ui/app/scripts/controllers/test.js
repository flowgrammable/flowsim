'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SimulationCtrl
 * @description
 * # SimulationCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
    .controller('TestCtrl', function($scope) {

        $scope.view = JSON.parse('{"table":0,"group":"","meter":"","buffer":0,"actionSet":[],"instructionSet":[],"key":[{"name":"Internal","attrs":[{"name":"in_port","value":"1"},{"name":"in_phy_port","value":"1"},{"name":"tunnel_id","value":"1"},{"name":"metadata","value":"0x0000000000000000"}]}],"packet":{"name":"aaa","bytes":86,"protocols":[{"name":"Ethernet","bytes":18,"fields":[{"name":"Src","value":"0:0:0:0:0:0"},{"name":"Dst","value":"0:0:0:0:0:0"},{"name":"Type","value":"0x8100"}]},{"name":"VLAN","bytes":4,"fields":[{"name":"PCP","value":"0x0"},{"name":"VID","value":"0x000"},{"name":"Type","value":"0x8100"}]},{"name":"VLAN","bytes":4,"fields":[{"name":"PCP","value":"0x0"},{"name":"VID","value":"0x000"},{"name":"Type","value":"0x86dd"}]},{"name":"IPv6","bytes":40,"fields":[{"name":"Flabel","value":"0x00000"},{"name":"Src","value":"0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0"},{"name":"Dst","value":"0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0"},{"name":"TTL","value":"0x00"}]},{"name":"TCP","bytes":20,"fields":[{"name":"Src","value":"0x0000"},{"name":"Dst","value":"0x0000"}]},{"name":"Payload","bytes":0,"fields":[{"name":"Size","value":"0x0000"}]}]}}');
$scope.keys = JSON.parse('{"key":[{"name":"Internal","attrs":[{"name":"in_port","value":"1"},{"name":"in_phy_port","value":"1"},{"name":"tunnel_id","value":"1"},{"name":"metadata","value":"0x0000000000000000"}]},{"name":"Ethernet","attrs":[{"name":"Src","value":"0:0:0:0:0:0"},{"name":"Dst","value":"0:0:0:0:0:0"},{"name":"Type","value":"33024"}]},{"name":"VLAN","attrs":[{"name":"PCP","value":"0"},{"name":"VID","value":"0"},{"name":"Type","value":"33024"}]},{"name":"VLAN","attrs":[{"name":"PCP","value":"0"},{"name":"VID","value":"0"},{"name":"Type","value":"34525"}]},{"name":"IPv6","attrs":[{"name":"Flabel","value":"0"},{"name":"Src","value":"0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0"},{"name":"Dst","value":"0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0"},{"name":"TTL","value":"0"}]},{"name":"TCP","attrs":[{"name":"Src","value":"0"},{"name":"Dst","value":"0"}]},{"name":"Payload","attrs":[{"name":"Size","value":"0"}]}]}');
$scope.idx = 1;
        $scope.step =function() {
            $scope.view.key.push($scope.keys.key[$scope.idx++]);
            

        };

    });
