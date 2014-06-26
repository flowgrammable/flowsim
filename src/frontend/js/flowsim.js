
var flowsimApp = angular.module('flowsimApp', ['ngRoute', 'ui.bootstrap']);

flowsimApp.controller('registrationCntrl', function($scope) {
  $scope.emailAddr = '';
  $scope.password1 = '';
  $scope.password2 = '';
  $scope.sent = false;
  $scope.register = function() {
    var pwdRegex = /^[a-zA-Z0-9_]{8,}$/;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(emailRegex.test($scope.emailAddr)) {
      $scope.badEmail = false;
    } else {
      $scope.badEmail = true;
    }
    if(pwdRegex.test($scope.password1)) {
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
      $scope.sent = true;
    }
  }
});

flowsimApp.controller('resetCntrl', function($scope) {
  $scope.sent = false;
  $scope.emailAddr = '';
  $scope.reset = function() {
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(emailRegex.test($scope.emailAddr)) {
      $scope.sent = true;
    } else {
      $scope.badEmail = true;
    }
  }
});

flowsimApp.controller('loginCntrl', function($scope, $location) {
  $scope.emailAddr = '';
  $scope.password = '';
  $scope.login = function() {
    var pwdRegex = /^[a-zA-Z0-9_]{8,}$/;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailRegex.test($scope.emailAddr)) {
      $scope.badEmail = true;
    } else {
      $scope.badEmail = false;
    }
    if(loginForm.userPwd.$invalid || !pwdRegex.test($scope.password)) {
      $scope.badPwd = true;
    } else {
      $scope.badPwd = false;
    }
    if(!$scope.badEmail && !$scope.badPwd) {
      $location.path("/");
    }
  };
});

flowsimApp.controller('verifyCntrl', function($scope, $routeParams, $http) {
  $http({
    url: '/api/subscriber/verify/' + $routeParams.sid + '/' + $routeParams.token,
    method: 'PUT'
  }).success(function(data) {
    $scope.verified = true;
  }).error(function(data) {
    $scope.verified = false;
  });
});

flowsimApp.controller('menuCtrl', function($scope, $http) {
  $scope.authenticated = false;
  $scope.token = '';

  $scope.logout = function() {
    $scope.authenticated = false;
    $scope.token = '';
  }
  /*
  $scope.login = function() {
    $http({
      url: '/api/login',
      method: 'POST',
      data: JSON.stringify({
        email: 'jasson.casey@gmail.com',
        password: 'openflow'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
  }).success(function(data) {
    if(data.token) {
      $scope.authenticated = true;
      $scope.token = data.token;
      console.log("recieved token: %s", data.token);
    } else {
      console.log("success but no token");
    }
  }).error(function(data) {
    console.log('login fail');
  });
  $scope.logout = function() {
    $scope.authenticated = false;
    $scope.token = '';
  }};*/
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

