
var fgUtils = (function(){

var _isUInt16 = function(i) {
  return (typeof i == "number") && isFinite(i) && (i%1===0) &&
    i >= 0 && i <= 65535;
}

return {
  isUInt16: _isUInt16;
};

})();

