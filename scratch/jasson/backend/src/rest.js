
exports.responder = function(res) {
  var response = res;
  return function(result) {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(result));
  };
};

exports.addHandler = function(server, type, path, handler) {
  switch(type) {
    case 'post':
    case 'get':
    case 'put':
    case 'delete':
      server[type](path, handler);
      break;
    default:
      throw "Unknown restify method: " + type;
      break;
  }
};

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

