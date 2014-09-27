
(function(){

function _error(data) {
  return {
    error: data || {};
  };
}
exports.error = _error;

function _success(data) {
  return {
    value: data || {};
  };
}
exports.success = _success;

function _wrap(err, result) {
  if(err) {
    return _error(err);
  } else {
    return _success(result);
  }
}
exports.wrap = _wrap;

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

