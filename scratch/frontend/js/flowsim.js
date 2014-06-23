
var flowsimApp = angular.module('flowsimApp', ['ngRoute']);

flowsimApp.controller('registrationCtrl', function($scope) {
  $scope.emailAddr = '';
  $scope.password1 = '';
  $scope.password2 = '';
  $scope.sent = false;
  $scope.register = function() {
    console.log('%s %s/%s', $scope.emailAddr, $scope.password1, 
                $scope.password2);
    $scope.sent = true;
  }
});

flowsimApp.controller('resetCntrl', function($scope) {
  $scope.sent = false;
  $scope.reset = function() {
    $scope.sent = true;
  }
});

flowsimApp.controller('passwordCntrl', function($scope) {
  $scope.sent = false;
  $scope.save = function() {
    $scope.sent = true;
  }

});

flowsimApp.controller('mainCtrl', function($scope, $http) {
  $scope.authenticated = false;
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
    }
  }).error(function(data) {
    console.log('login fail');
  });
  $scope.logout = function() {
    $scope.authenticated = false;
    $scope.token = '';
  }};
});

flowsimApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'main.html'
    }).
    when('/openflow', {
      templateUrl: 'openflow.html'
    }).
    when('/about', {
      templateUrl: 'about.html'
    }).
    when('/profile', {
      templateUrl: 'profile.html'
    }).
    when('/packet', {
      templateUrl: 'packet.html'
    }).
    when('/trace', {
      templateUrl: 'trace.html'
    }).
    when('/switch', {
      templateUrl: 'switch.html'
    }).
    when('/simulation', {
      templateUrl: 'simulation.html'
    }).
    when('/register', {
      templateUrl: 'account/register.html'
    }).
    when('/reset', {
      templateUrl: 'account/reset.html'
    }).
    when('/password', {
      templateUrl: 'account/password.html'
    }).
    when('/badpassword', {
      templateUrl: 'account/badpassword.html'
    }).
    when('/account', {
      templateUrl: 'account/account.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

