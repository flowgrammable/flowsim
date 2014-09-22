
/**
 * @module utils
 */

(/** @lends module:utils */function(){

/**
 * @function success
 * @param {object} data - blah
 */
exports.success = function(data) {
  return {
    value: data || {}
  };
};

/**
 * @function error
 * @param {object} data - blah
 */
exports.error = function(data) {
  return {
    error: data || {}
  };
};

})();

