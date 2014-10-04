
(function(){

angular.module('fgSubscriber')
  .factory('SubscriberRest', function($resource) {
    var _authToken = '';
    return {
      get: function() { return _authToken; },
      set: function(t) { _authToken = t; },
      ops: $resource('/api/subscriber/:op',
        {
          op: '@op'
        }, {
          'register': { method: 'POST', params: { op: 'register' } },
          'verify':   { method: 'POST', params: { op: 'verify' } },
          'forgot':   { method: 'POST', params: { op: 'forgot' } },
          'login':    { method: 'POST', params: { op: 'login' } },
          'logout':   { method: 'POST', params: { op: 'logout' },
                        headers: { 'x-access-token': _x_access_token } },
          'update':   { method: 'POST', params: { op: 'update' },
                        headers: { 'x-access-token': _x_access_token } }
        })
    };
  });

})();

