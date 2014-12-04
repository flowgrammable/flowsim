'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.noproto
 * @description
 * # noproto
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Noproto', function(UInt) {

function Field(params) {
  if(!params.protoName) {
    throw 'Fail Construction: Field('+params.protoName+')';
  }
  if(!params.name) {
    throw 'Fail Construction: Field('+params.name+')';
  }
  if(!_(params.bitwidth).isFinite()) {
    throw 'Fail Construction: Field('+params.bitwidth+')';
  }
  // Display string about the parent protocol
  this.protoName = params.protoName;
  // Display string for this field
  this.name = params.name;
  // Display string that is small
  this.shortName = params.shortName || this.name.toLowerCase();
  // Bit precision of this field
  this.bitwidth = params.bitwidth;
  // Can this field be matched against
  this.matchable = params.matchable || false;
  // Can this field be modified
  this.setable = params.setable || false;
  // Can this feild be decremented
  this.decable = params.decable || false;
  // String input test function 
  this.testStr = params.testStr || null;
  // Display string conversion function
  this.toString = params.toString || null;
  // Display string describing the field
  this.tip = params.tip || this.protoName + ' ' + this.name;
}

function Protocol(params) {
  // Display string of the protocol
  this.name = params.name;
  // Display string that is small
  this.shortName = params.shortName || this.name.toLowerCase();
  // Size of the protocol in bytes
  this.bytes = params.bytes;
  // Can this protocol be tag/label pushed
  this.pushable = params.pushable || false;
  // Can this protocol be tag/label popped
  this.popable = params.popable || false;
  // Construct the protocol fields
  this.fields = _(params.fields).map(function(field) {
    field.protoName = this.name;
    return new Field(field);
  }, this);
  // Attach a name/key for each field
  _(this.fields).each(function(field) {
    if(_(this).has(field.name)) {
      throw 'Duplicate Field: '+this.name+'('+field.name+')';
    }
    this[field.name] = field;
  }, this);
}

// Extraction

// Match

// Action

return {
  Protocol: Protocol
};

});
