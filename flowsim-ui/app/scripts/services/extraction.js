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

var extractors = {};

// Get extractors


function extractField(ctx, proto, field){
  Protocols.Extractors[proto.name][field.name].extract(ctx.key, field.value);
}

function extractProtocol(ctx, proto){
  if(proto.name !== 'VLAN' && proto.name !== 'MPLS'){
      ctx.key[proto.name] = {};
    _(proto.fields).each(function(field){
      extractField(ctx, proto, field);
    });
  } else {
    extractTag(ctx, proto);
  }
}

function extractTag(ctx, proto){
  var tag = {};
  _(proto.fields).each(function(field){
    tag[field.name] = field.value;
  });
  ctx.key[proto.name].push(tag);
}

function extract(ctx) {
  _(ctx.packet.protocols).each(function(proto){
    extractProtocol(ctx, proto);
  }, this);
}

return {
  extract: extract,
};

});
