
/**
 * @module utils
 */

(/** @lends module:utils */function(){

/**
 * @function success
 * @param {object} data - blah
 */
function _success(data) {
  return {
    value: data || {}
  };
}
exports.success = _success;

/**
 * @function error
 * @param {object} data - blah
 */
function _error(data) {
  return {
    error: data || {}
  };
}
exports.error = _error;

exports.wrap = function(err, succ) {
  if(err) {
    return _error(err);
  } else {
    return _success(succ);
  }
};

exports.filter = function(filter, pre, post) {
  var _filter, _pre, _post;

  _filter = filter || function(id) { return id; };
  _pre  = pre      || null;
  _post = post     || null;

  return function(msg) {
    if(_pre) {
      _pre(msg);
    }
    msg = _filter(msg);
    if(_post) {
      _post(msg);
    }
    return msg;
  };
};

})();

