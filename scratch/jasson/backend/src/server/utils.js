
/**
 * @module server
 */

(/** @lends module:server */function(){

/**
 * Wraps the provided data with an error tag.
 *
 * @param {Object} data - object to wrap
 * @returns {Object} an error tagged object containing data
 */
function _error(data) {
  return {
    error: data || {}
  };
}

/**
 * Wraps the provided data with a value tag.
 *
 * @param {Object} data - object to wrap
 * @returns {Object} a value tagged object containing data
 */
function _success(data) {
  return {
    value: data || {}
  };
}

/**
 * This function takes an error and success paramter and converts
 * them into a tagged error or value object. This operaiton is quite useful when
 * converting from an error/success parameter set to a singular return object.
 *
 * @param {Object} err - error object
 * @param {Object} success - success object
 * @returns {Object} returns an error or value tagged result
 */
function _tag(err, success) {
  if(err) {
    return _error(err);
  } else {
    return _success(success);
  }
}

/**
 * A Responder is a continuation passing object type that is useful for handling
 * asynchronous HTTP responses. The object is constructed using a node http
 * response object. The consructed object is a function that will take an error
 * and success paramter. Whichever parameter is provided will by tagged as
 * either an error or value, stringified as a JSON object, and returned in the
 * body of the HTTP response.
 *
 * @param {Object} res - a response object
 * @return {Function} an asynchronous error/success function
 */
function Responder(res) {
  var response = res;
  return function(err, result) {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(_tag(err, result)));
  };
}
exports.Responder = Responder;

exports.requiresAuth = function(callback) {
  return function(req, res, next) {
    if(req.subscriber_id && req.session_id) {
      callback(req, res, next);
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(_error({
        system: '*/*',
        type: 'authorizationRequired'
      })));
    }
  };
};

})();

