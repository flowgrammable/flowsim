'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.internals
 * @description
 * # internals
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('INTERNALS', function(UInt) {

var NAME = 'INTERNALS';

function INTERNALS(int, port, phyPort, metadata){
  if(_.isObject(int)){
    this._port = new UInt.UInt(int._port);
    this._phyPort = new UInt.UInt(int._phyPort);
    this._metadata = mkMetadata(int._metadata);
  } else {
    this._port = new UInt.UInt(null, port, 4);
    this._phyPort = new UInt.UInt(null, phyPort, 4);
    this._metadata = mkMetadata(metadata);
  }
  this.name = NAME;
}

function mkInternals(port, phyPort, metadata){
  return new INTERNALS(null, port, phyPort, metadata);
}

INTERNALS.prototype.port = function(port){
  if(port){
    if(port instanceof UInt.UInt){
      this._port = new UInt.UInt(port);
    } else {
      this._port = new UInt.UInt(null, port, 4);
    }
  } else {
    return this._port;
  }
};

function mkPort(port){
  return new UInt.UInt(null, port, 4);
}

function mkPortMatch(value){
  var tmp = new UInt.Match(null, mkPort(value),
      new UInt.UInt(null, '0xffff', 4));
  tmp.summarize = function() {
    return 'internals';
  };
  return tmp;
}

INTERNALS.prototype.phyPort = function(phyPort){
  if(phyPort){
    if(phyPort instanceof UInt.UInt){
      this._phyPort = new UInt.UInt(phyPort);
    } else {
      this._phyPort = new UInt.UInt(null, phyPort, 4);
    }
  } else {
    return this._phyPort;
  }
};

function mkPhyport(phyPort){
  return new UInt.UInt(null, phyPort, 4);
}

function mkPhyportMatch(value){
  var tmp = new UInt.Match(null, mkPhyport(value),
      new UInt.UInt(null, '0xffff', 4));
  tmp.summarize = function() {
    return 'internals';
  };
  return tmp;
}

INTERNALS.prototype.metadata = function(metadata){
  if(metadata){
    this._metadata = mkMetadata(metadata);
  } else {
    return this._metadata;
  }
};


var Pattern = /^(0x)?[0-9a-fA-F]+$/;

function Metadata(meta, input){
  var tmp;
  if(_.isObject(meta)) {
    this._meta = new UInt.UInt(meta._meta);
  } else if(_.isString(input)){
    if(!Pattern.test(input)) {
      throw 'Metadata('+meta+', '+input+')';
    }
    tmp = input.match(Pattern);
    if(!tmp){
      throw 'Bad Meta: ' + input;
    }
    tmp =[];
    for(var i= 2; i<input.length; i+=2){
      tmp.push(parseInt('0x'+input.substr(i, 2)));
    }
    this._meta = new UInt.UInt( null, tmp , 8);
  } else if(_.isArray(input)){
    this._meta = new UInt.UInt(null, input, 8);
  } else {
    this._meta = new UInt.UInt(null, null, 8);
  }
}

Metadata.is = function(meta){
  return Pattern.test(meta);
};

Metadata.prototype.clone = function() {
  return new Metadata(this);
};

Metadata.prototype.toString = function(){
  return  '0x' + _(this._meta.value).map(function(oct) {
    return oct.toString(16);
  }).join('');
};

Metadata.Match = function(match, value, mask) {
  if(_.isObject(match)) {
    this._match = new UInt.Match(match._match);
  } else {
    this._match = new UInt.Match(null, mkMetadata(value)._meta, mkMetadata(mask)._meta);
  }
};

Metadata.Match.prototype.clone = function() {
  return new Metadata.Match(this);
};

Metadata.Match.prototype.match = function(meta){
  return this._match.match(meta._meta);
};

Metadata.Match.prototype.equal = function(meta){
  return this._match.equal(meta._match);
};

Metadata.Match.prototype.summarize = function() {
  return 'internal';
};

function mkMetadata(metadata){
  if(_.isObject(metadata)) {
    return new Metadata(metadata);
  } else {
    return new Metadata(null, metadata);
  }
}

function mkMetadataMatch(value, mask){
  return new Metadata.Match(null, value, mask);
}

INTERNALS.prototype.clone = function(){
  return new INTERNALS(this);
};

INTERNALS.prototype.toString = function(){
  return 'in_port: '+this.port().toString()+'\n'+
         'phy_port: '+this.phyPort().toString()+'\n'+
         'metadata: '+this.metadata().toString();
};

var TESTS = {
  port: UInt.is(32),
  phyPort: UInt.is(32),
  metadata: Metadata.is
};

var TIPS = {
  port: 'Ingress port',
  phyPort: 'Physical port',
  metadata: 'Metadata'
};

function INTERNALS_UI(inter) {
  inter = inter ? new INTERNALS(inter) : new INTERNALS();
  this.name = NAME;
  this.attrs = [{
    name: 'In Port',
    value: inter.port().toString(),
    test: TESTS.port,
    tip: TIPS.port
  }, {
    name: 'Phy Port',
    value: inter.phyPort().toString(),
    test: TESTS.phyPort,
    tip: TIPS.phyPort
  }, {
    name: 'Metadata',
    value: inter.metadata().toString(),
    test: Metadata.is,
    tip: TIPS.metadata
  }];
}

return {
  name: NAME,
  INTERNALS: INTERNALS,
  port: '_port',
  phyPort: '_phyPort',
  metadata: '_metadata',
  Metadata: Metadata,
  mkMetadata: mkMetadata,
  mkMetadataMatch: mkMetadataMatch,
  mkInternals: mkInternals,
  mkPort: mkPort,
  mkPortMatch: mkPortMatch,
  mkPhyport: mkPhyport,
  mkPhyportMatch: mkPhyportMatch,
  create: function(inter) { return new INTERNALS(inter); },
  createUI: function(inter) { return new INTERNALS_UI(inter); }
};


});
