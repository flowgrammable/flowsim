(function(){

var pcpPattern = /^[0-7]$/;

exports.isPcp = function(pcp) {
  return pcpPattern.test(pcp);
};

var deiPattern = /^[0-1]$/;

exports.isDei = function(dei) {
  return deiPattern.test(dei);
};

var vidPattern = /^0x0[a-fA-F0-9]{3}$/;

exports.isVid = function(vid){
  return vidPattern.test(vid);
};

var typeLen = /^0x[a-fA-F0-9]{4}$/;

exports.isTypelen = function(type){
  return typeLen.test(type);
};

exports.vlan = function(){
  return {
        bytes: 4,
        fields: {
          'pcp' : this.isPcp,
          'dei' : this.isDei,
          'vid': this.isVid,
          'typelen' : this.typeLen
          },
        sequence: ['VLAN', 'MPLS', 'ARP', 'IPv4', 'IPv6']
  };
};

})();
