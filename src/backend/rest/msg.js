
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

exports.test = function(result, succ, err) {
  if(result.success) {
    return succ(result.success.result);
  } else if(result.error) {
    if(typeof(err) != 'undefined')) {
      return err(result.error);
    } else {
      return result;
    }
  } else {
    throw "Undefined success and error objects";
  }
}

