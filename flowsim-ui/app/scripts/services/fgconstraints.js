
angular.module('flowsimUiApp')
  .service('fgConstraints', function fgConstraints() {
        
function isUInt(lb, ub) {
  var decPat = /^[0-9]+$/;
  var hexPat = /^0x[0-9a-fA-F]+$/;
  return function(val) {
    var _val;
    // make sure its a number or fail
    if(typeof val === 'number') {
      _val = val;
    } else if(typeof val === 'string') {
      if(decPat.test(val)) {
        _val = parseInt(val, 10);
      } else if(hexPat.test(val)) {
        _val = parseInt(val, 16);
      } else {
        return false;
      }
    } else {
      return false;
    }
    return lb <= _val && _val <= ub;
  };
}

return {
  isUInt: isUInt
};

});

