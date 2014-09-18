
(function(){

function Delegate(res) {
  var response = res;
  return function(result) {
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(result));
  };
}
exports.Delegate = Delegate;

})();

