
exports.success = function(data, other) {
  return {
    value: data || {},
    tunnel: other || {}
  }
}

exports.error = function(data, other) {
  return {
    error: data
  }
}

exports.test = function(result, succ, err) {
  console.log('result', result);
  if(result.success) {
    return succ(result.success.result);
  } else if(result.error) {
    if(typeof(err) != 'undefined') {
      return err(result.error);
    } else {
      return result;
    }
  } else {
    throw "Undefined success and error objects";
  }
}

