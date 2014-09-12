
function Match(value, mask) {
  if (value.length != mask.length)
    throw "Bad Rule: length mismatch";
  this.value = value.slice(0);
  this.mask = mask.slice(0);
}

Match.prototype.matches = function(key) {
  var i;
  for(i=0; i<key.length; ++i) {
    if ((key[i] & this.mask[i]) != this.value[i]) {
      return false;
    }
  }
  return true;
}

Match.prototype.less = function(rhs) {
  var i;
  if(this.value.length < rhs.value.length)
    return true;
  if(rhs.value.length < this.value.length)
    return false;
  for(i=0; i<value.length; ++i) {
    if((this.value[i] & this.mask[i]) < (rhs.value[i] & rhs.mask[i]))
      return true;
    if((rhs.value[i] & rhs.mask[i]) < (this.value[i] & this.mask[i]))
      return false;
  }
  return false;
}

Match.prototype.equal = function(rhs) {
  if(rhs.value.length != this.value.length)
    return false;
  for(i=0; i<value.length; ++i) {
    if((this.value[i] & this.mask[i]) != (rhs.value[i] & rhs.mask[i]))
      return false;
  }
  return true;
}

exports.Match = Match;

function Flow(match, policy) {
  this.match = match;
  this.policy = policy;
}

Flow.prototype.match = function(key) {
  if(this.match.matches(key))
    return this.policy;
  else
    return null;
}

exports.Flow = Flow;

function Flows() {
  this.flows = [];
  this.lookups = 0;
  this.matches = 0;
}

Flows.prototype.add = function(flow) {
  this.flows.push(flow);
}

Flows.prototype.lookup = function(flow) {
  var i;

  this.lookups++;
  for(i=0; i<this.flows.length; ++i) {
    if(this.flows[i].match.equals(flow.match)) {
      this.matches++;
      return this.flows[i];
    }
  }
  return null;
}

Flows.prototype.del = function(flow) {
  var i;
  for(i=0; i<this.flows.length; ++i) {
    if(this.flows[i].match.equals(flow.match)) {
      this.flows.splice(i, 1);
    }
  }
}

exports.Flows = Flows;
