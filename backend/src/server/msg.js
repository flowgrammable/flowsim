
(function(){

exports.success = function() {
  return '';
};

exports.routeDoesNotExist = function(url){
  return JSON.stringify({
    message: url + ' does not exist',
    details: {
      system: 'restServer',
      type: 'invalidRoute'
    }
  });
};

})();
