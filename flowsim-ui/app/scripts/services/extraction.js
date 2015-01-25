'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Extraction', function(Protocols) {


function extractField(ctx, proto, field){
  Protocols.Extractors[proto.name][field.name].extract(ctx.key, field.value);
}

function extractProtocol(ctx, proto){
  if(proto.name !== 'VLAN' && proto.name !== 'MPLS'){
      ctx.key[proto.name] = {};
    _(proto.fields).each(function(field){
      extractField(ctx, proto, field);
    });
    return true;
  } else {
    extractTag(ctx, proto);
    return true;
  }
}

function extractTag(ctx, proto){
  var tag = {};
  _(proto.fields).each(function(field){
    tag[field.name] = field.value;
  });
  if(!ctx.key[proto.name]){
    ctx.key[proto.name] = [];
  }
  ctx.key[proto.name].push(tag);
}

function Extractor(){

}

Extractor.prototype.extract = function(ctx){
  if(!this.clonedPacket){
    this.clonedPacket = ctx.packet.clone();
  }
  if(this.clonedPacket.protocols.length > 0){
    return extractProtocol(ctx, this.clonedPacket.protocols.shift());
  } else {
    return false;
  }
};

Extractor.prototype.isDone = function(){
  return !this.clonedPacket.protocols.length;
};

return {
  Extractor: Extractor
};

});