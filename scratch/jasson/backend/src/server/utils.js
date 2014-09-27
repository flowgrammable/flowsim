
(function(){

function _error(data) {
  return {
    error: data || {};
  };
}

function _success(data) {
  return {
    value: data || {};
  };
}

function _wrap(err, result) {
  if(err) {
    return _error(err);
  } else {
    return _success(result);
  }
}

function Delegate(res) {
  var response = res;
  return function(err, result) {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    if(err) {
      response.end(JSON.stringify(_wrap(err)));
    } else {
      response.end(JSON.stringify(_wrap(result)));
    }
  };
}
exports.Delegate = Delegate;

})();

