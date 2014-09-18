
exports.success = function(data) {
  return {
    value: data || {}
  };
};

exports.error = function(data) {
  return {
    error: data || {}
  };
};

