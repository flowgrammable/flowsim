
var flowsimApp = angular.module('flowsimApp', ['ngRoute', 'ui.bootstrap',
    'flowAPI']);

flowsimApp.controller('registrationCntrl', function($scope, utils, flowgrammable) {
  $scope.emailAddr = '';
  $scope.password1 = '';
  $scope.password2 = '';
  $scope.sent = false;
  $scope.register = function() {
    if(utils.validEmail($scope.emailAddr)) {
      $scope.badEmail = false;
    } else {
      $scope.badEmail = true;
    }
    if(utils.validPwd($scope.password1)) {
      $scope.badPwd1 = false;
    } else {
      $scope.badPwd1 = true;
    }
    if($scope.password1 == $scope.password2) {
      $scope.badPwd2 = false;
    } else {
      $scope.badPwd2 = true;
    }
    if(!$scope.badEmail && !$scope.badPwd1 & !$scope.badPwd2) {
      flowgrammable.register($scope.emailAddr, $scope.password1);
      $scope.sent = true;
    }
  }
});

flowsimApp.controller('resetCntrl', function($scope, flowgrammable) {
  $scope.sent = false;
  $scope.emailAddr = '';
  $scope.reset = function() {
    if(utils.validEmail($scope.emailAddr)) {
      flowgrammable.reset($scope.emailAddr);
      $scope.sent = true;
    } else {
      $scope.badEmail = true;
    }
  }
});

flowsimApp.controller('loginCntrl', function($scope, $location, flowgrammable) {
  $scope.emailAddr = '';
  $scope.password = '';
  $scope.login = function() {
    if(!utils.validEmail($scope.emailAddr)) {
      $scope.badEmail = true;
    } else {
      $scope.badEmail = false;
    }
    if(!utils.validPwd($scope.password)) {
      $scope.badPwd = true;
    } else {
      $scope.badPwd = false;
    }
    if(!$scope.badEmail && !$scope.badPwd) {
      flowgrammable.login($scope.emailAddr, $scope.password);
      $location.path("/");
    }
  };
});

flowsimApp.controller('verifyCntrl', function($scope, $routeParams, 
                        flowgrammable) {
  flowgrammable.verify($routeParams.token);
});

flowsimApp.controller('menuCtrl', function($scope, $http) {
  $scope.authenticated = false;
  $scope.token = '';

  $scope.logout = function() {
    $scope.authenticated = false;
    $scope.token = '';
  }
});

flowsimApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'main.html'
    }).
    when('/about', {
      templateUrl: 'about.html'
    }).
    when('/login', {
      templateUrl: 'login.html',
      controller: 'loginCntrl'
    }).
    when('/register', {
      templateUrl: 'register.html',
      controller: 'registrationCntrl'
    }).
    when('/reset', {
      templateUrl: 'reset.html',
      controller: 'resetCntrl'
    }).
    when('/verify/:sid/:token', {
      templateUrl: 'verify.html',
      controller: 'verifyCntrl'
    }).
    otherwise({
      templateUrl: 'lost.html'
    });
}]);

