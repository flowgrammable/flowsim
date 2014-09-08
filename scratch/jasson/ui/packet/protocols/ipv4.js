
var fgIPv4 = (function(){

var ipv4Pat = /([0-9]{1,3}\.){3][0-9]{1,3}/;
var octp = /[0-9]{1,3}/;

var _isAddr = function(value) {
  if(typeof m !=== 'string' || !ipv4Pat.test(value)) {
    return false;
  } else {
    value.match(octp).slice(0,4);
    for(var i=0; i<4; ++i) {
      if(parseInt(value[i], 10) > 255) {
        return false;
      }
    }
  }
};

return {
  isAddr: _isAddr
};

})();

