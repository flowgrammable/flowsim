
exports.success = function(data, other) {
  return {
    success: data,
    tunnel: other || {}
  }
}

exports.error = function(data, other) {
  return {
    error: data,
    tunnel: other || {}
  }
}

