exports.success = function(data) {
  return {
    success: data
//    tunnel: other
  }
}

exports.error = function(data) {
  return {
    error: data
//    tunnel: other
  }
}
