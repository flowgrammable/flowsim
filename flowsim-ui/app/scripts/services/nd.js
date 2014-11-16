'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.nd
 * @description
 * # nd
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('ND', function(UInt, ETHERNET, IPV6) {

var NAME = 'ND';
var BYTES = 8;

var Payloads = {
  'Payload' : 0
};

function ND(nd, target, hw) {
  if(_.isObject(nd)) {
    this._target = IPV6.mkAddress(nd._target);
    this._hw = ETHERNET.mkMAC(nd._hw);
  } else {
    this._target = IPV6.mkAddress(target);
    this._hw = ETHERNET.mkMAC(hw);
  }
  this.name = NAME;
  this.bytes = BYTES;
}

function mkND(target, hw) {
  return new ND(null, target, hw);
}

ND.prototype.target = function(target){
  if(target){
    this._target = IPV6.mkAddress(target);
  } else {
    return this._target;
  }
};

function mkTarget(tar){
  return new IPV6.mkAddress(tar);
}

function mkTargetMatch(value, mask){
  var tmp = new IPV6.Address.Match(null,
    IPV6.mkAddress(value), IPV6.mkAddress(mask));
  tmp.summarize = function() {
    return 'nd';
  };
  return tmp;
}

ND.prototype.hw = function(hw){
  if(hw){
    this._hw = ETHERNET.mkMAC(hw);
  } else {
    return this._hw;
  }
};

ND.prototype.clone = function(){
  return new ND(this);
};

ND.prototype.toString = function(){
  return 'target: '+this.target().toString()+'\n'+
         'hw:     '+this.hw().toString();
};

function mkHWMatch(value, mask){
  var tmp = new ETHERNET.MAC.Match(null, ETHERNET.mkMAC(value),
    ETHERNET.mkMAC(mask));
  tmp.summarize = function() {
    return 'nd';
  };
  return tmp;
}

var TIPS = {
  target: 'Target Address',
  hw: 'Link Layer Address'
};

var TESTS = {
  target: IPV6.Address.is,
  hw: ETHERNET.MAC.is
};



function ND_UI(nd){
  nd = nd ? new ND(nd) : new ND();
  this.name = NAME;
  this.bytes = nd.bytes;
  this.attrs = [{
    name: 'Target',
    value: nd.target().toString(),
    test: TESTS.target,
    tip: TIPS.target
  },{
    name: 'HW Address',
    value: nd.hw().toString(),
    test: TESTS.hw,
    tip: TIPS.hw
  }];
}

ND_UI.prototype.toBase = function() {
  return new ND(null, this.attrs[0].value, this.attrs[1].value);
};

ND_UI.prototype.setPayload = function() {
};

ND_UI.prototype.clearPayload = function() {
};

return {
  name:           NAME,
  ND:             ND,
  mkND:           mkND,
  mkTarget:       mkTarget,
  mkTargetMatch:  mkTargetMatch,
  mkHWMatch:      mkHWMatch,
  target:         '_target',
  hw:             '_hw',
  create:         function(nd){ return new ND(nd); },
  createUI:       function(nd){ return new ND_UI(nd); },
  Payloads:       _(Payloads).keys(),
  TIPS:           TIPS,
  TESTS:          TESTS
};

});
