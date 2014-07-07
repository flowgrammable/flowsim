exports.error = function(data, other) {
  return {
    error: data,
    tunnel: other || {}
  }
}

exports.success = function(data, other) {
  return {
    success: data,
    tunnel: other || {}
  }
}