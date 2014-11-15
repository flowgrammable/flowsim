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

        $scope.view = JSON.parse('{"meter":-1,"buffer":0,"packet":{"name":"sa","bytes":14,"protocols":[{"name":"Ethernet","bytes":14,"attrs":[{"name":"Src","value":"00:00:00:00:00:00","tip":"Ethernet source address","$$hashKey":"0PY"},{"name":"Dst","value":"00:00:00:00:00:00","tip":"Ethernet destination address","$$hashKey":"0PZ"},{"name":"Type/Length","value":"0x0000","tip":"Ethernet payload type or length","$$hashKey":"0Q0"}],"$$hashKey":"0PW","fieldBlockHeight":36,"fieldBlockYOffset":54}]},"actionSet":[{"name":"eth","value1":"src=","value2":"00:00:00:00:00:00"},{"name":"eth","value1":"dst=","value2":"00:00:00:00:00:00"},{"name":"queue","value1":5},{"name":"Output","value1":2}],"instructionSet":[{"name":"Meter","value1":1234,"$$hashKey":"0QG"},{"name":"Apply","set":[{"name":"eth","value1":"src=","value2":"01:00:00:00:00:00","$$hashKey":"0Q4"},{"name":"vlan","value1":"vid=","value2":"2","$$hashKey":"0Q5"},{"name":"Output","value1":1,"$$hashKey":"0Q6"}],"$$hashKey":"0QH"},{"name":"Clear","$$hashKey":"0QI"},{"name":"Write","set":[{"name":"group","value1":2,"$$hashKey":"022"},{"name":"group","value1":2,"$$hashKey":"033"},{"name":"group","value1":2,"$$hashKey":"2121"},{"name":"group","value1":2,"$$hashKey":"02121212"},{"name":"group","value1":2,"$$hashKey":"40"},{"name":"group","value1":2,"$$hashKey":"30"},{"name":"group","value1":2,"$$hashKey":"20"},{"name":"group","value1":2,"$$hashKey":"50"},{"name":"group","value1":2,"$$hashKey":"011"},{"name":"eth","value1":2,"$$hashKey":"01"}],"$$hashKey":"0QJ"},{"name":"Metadata","value1":"00:11:22:44:55:66:77,","value2":"00:ff:ff:00:00:ff:ff","$$hashKey":"0QK"},{"name":"Goto","value1":5,"$$hashKey":"0QL"}]}');

        $scope.step =function() {
                if ($scope.view.instructionSet[0].name === "Apply" && _.size($scope.view.instructionSet[0].set) > 0) {
                    $scope.view.instructionSet[0].set.shift();
                    if ($scope.view.instructionSet[0].set.length === 0) {
                        $scope.view.instructionSet.shift();
                    }
                } else if ($scope.view.instructionSet[0].name === "Write" && _.size($scope.view.instructionSet[0].set) > 0) {
                    $scope.view.actionSet.push($scope.view.instructionSet[0].set.shift());
                    if ($scope.$scope.view.instructionSet[0].set.length === 0) {
                        $scope.view.instructionSet.shift();
                    }
                } else {
                    $scope.view.instructionSet.shift();
                }

            }

    });
