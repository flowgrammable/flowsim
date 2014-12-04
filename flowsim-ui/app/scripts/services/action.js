'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.dataplane
 * @description
 * # dataplane
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Action', function(ETHERNET, VLAN, MPLS, ARP, IPV4, IPV6, ICMPV4,
                              ICMPV6, SCTP, TCP, UDP, ND, fgConstraints) {

var TIPS = {
  Internal: {
    Output: {
      '--n/a--': 'Forward the packet out a port'
    },
    Group: {
      '--n/a--': 'Forward the packet to a group'
    },
    Queue: {
      '--n/a--': 'Use the designated queue on the egress port'
    }
  },
  Ethernet: {
    Src: {
      set: 'Write Ethernet source'
    },
    Dst: {
      set: 'Write Ethernet destination'
    }
  },
  VLAN: {
    ID: {
      set: 'set the outter VLAN ID'
    },
    Priority: {
      set: 'set the VLAN Priority'
    },
    Tag: {
      push: 'push a new VLAN tag',
      pop: 'pop the outter VLAN tag'
    }
  },
  MPLS: {
    Label: {
      set: 'set the outter MPLS label',
      dec: 'decrement MPLS TTL'
    },
    TTL: {
      set: 'set MPLS ttl'
    },
    BOS: {
      set: 'set Bottom of Stack bit'
    },
    Tag: {
      push: 'push a new outer label',
      pop: 'pop the outer label'
    }
  },
  ARP: {
    Opcode: {
      set: 'Set ARP opcode'
    },
    SHA: {
      set: 'Set source hardware address'
    },
    SPA: {
      set: 'Set source protocol address'
    },
    THA: {
      set: 'Set target hardware address'
    },
    TPA: {
      set: 'Set target protocol address'
    }
  },
  IPv4: {
    DSCP: {
      set: 'Set differentiated services code type'
    },
    ECN : {
      set: 'Set explicit congestion notification'
    },
    Proto: {
      set: 'Set protocol type'
    },
    Src: {
      set: 'Set source address'
    },
    Dst: {
      set: 'Set destination address'
    },
    TTL: {
      set: 'Set TTL',
      dec: 'Decrement TTL',
      copy_out: 'Copy TTL out',
      copy_in: 'Copy TTL in'
    }
  },
  IPv6: {
    Src: {
      set: 'Set source address'
    },
    Dst: {
      set: 'Set destination address'
    },
    Flabel: {
      set: 'Set flabel'
    },
    TTL: {
      set: 'Set TTL',
      dec: 'Decrement TTL',
      copy_out: 'Copy TTL out',
      copy_in: 'Copy TTL in'
    }
  },
  ICMPv4: {
    Type: {
      set: 'Set type'
    },
    Code: {
      set: 'Set code'
    }
  },
  ICMPv6: {
    Type: {
      set: 'Set type'
    },
    Code: {
      set: 'Set code'
    }
  },
  TCP: {
    Src: {
      set: 'Set source port'
    },
    Dst: {
      set: 'Set destination port'
    }
  },
  UDP: {
    Src: {
      set: 'Set source port'
    },
    Dst: {
      set: 'Set destination port'
    }
  },
  SCTP: {
    Src: {
      set: 'Set source port'
    },
    Dst: {
      set: 'Set destination port'
    }
  },
  ND: {
    Target: {
      set: 'Set target'
    },
    HW: {
      set: 'Set hardware address'
    }
  }

};

var TESTS = {
  Internal: {
    Output: {
      '--n/a--': fgConstraints.isUInt(0, 0xffff)
    },
    Group: {
      '--n/a--': fgConstraints.isUInt(0, 0xffffffff)
    },
    Queue: {
      '--n/a--': fgConstraints.isUInt(0, 0xffffffff)
    }
  },
  Ethernet: {
    Src: {
      set: ETHERNET.MAC.is
    },
    Dst: {
      set: ETHERNET.MAC.is
    }
  },
  VLAN: {
    ID: {
      set: VLAN.TESTS.vid
    },
    Priority: {
      set: VLAN.TESTS.pcp
    },
    Tag: {
      push: function() { return true; },
      pop: function() { return true; }
    }
  },
  MPLS: {
    Label: {
      set: MPLS.TESTS.label,
      dec: function() { return true; }
    },
    TTL: {
      set: MPLS.TESTS.ttl
    },
    BOS: {
      set: MPLS.TESTS.bos
    },
    Tag: {
      push: function() { return true; },
      pop: function() { return true; }
    }
  },
  ARP: {
    Opcode: {
      set: fgConstraints.isUInt(0,0x2)
    },
    SHA: {
      set: ETHERNET.MAC.is
    },
    SPA: {
      set: IPV4.Address.is
    },
    THA: {
      set: ETHERNET.MAC.is
    },
    TPA: {
      set: IPV4.Address.is
    }
  },
  IPv4: {
    DSCP: {
      set: IPV4.TESTS.dscp
    },
    ECN: {
      set: IPV4.TESTS.ecn
    },
    Proto: {
      set: IPV4.TESTS.proto
    },
    Src: {
      set: IPV4.Address.is
    },
    Dst: {
      set: IPV4.Address.is
    },
    TTL: {
      set: IPV4.TESTS.ttl,
      dec: function() { return true; },
      copy_out: function() { return true; },
      copy_in: function() { return true; }
    }
  },
  IPv6: {
    Src: {
      set: IPV6.Address.is
    },
    Dst: {
      set: IPV6.Address.is
    },
    Flabel: {
      set: IPV6.TESTS.flabel
    },
    TTL: {
      set: IPV6.TESTS.ttl,
      dec: function() { return true; },
      copy_out: function() { return true; },
      copy_in: function() { return true; },
    }
  },
  ICMPv4: {
    Type: {
      set: ICMPV4.TESTS.type
    },
    Code: {
      set: ICMPV4.TESTS.code
    }
  },
  ICMPv6: {
    Type: {
      set: ICMPV6.TESTS.type
    },
    Code: {
      set: ICMPV6.TESTS.code
    }
  },
  TCP: {
    Src: {
      set: TCP.TESTS.src
    },
    Dst: {
      set: TCP.TESTS.dst
    }
  },
  UDP: {
    Src: {
      set: UDP.TESTS.src
    },
    Dst: {
      set: UDP.TESTS.dst
    }
  },
  SCTP: {
    Src: {
      set: SCTP.TESTS.src
    },
    Dst: {
      set: SCTP.TESTS.dst
    }
  },
  ND: {
    Target: {
      set: ND.TESTS.target
    },
    HW: {
      set: ND.TESTS.hw
    }
  }
};

var Types = {
  Internal: {
    Output: {
      '--n/a--': Output
    },
    Group: {
       '--n/a--': Group
    },
    Queue: {
       '--n/a--': Queue
    }
  },
  Ethernet: {
    Src: {
      set: SetField
    },
    Dst: {
      set: SetField
    }
  },
  VLAN: {
    ID: {
      set: SetField
    },
    Priority: {
      set: SetField
    },
    Tag: {
      push: PushVLAN,
      pop: PopVLAN
    }
  },
  MPLS: {
    Label: {
      set: SetField
    },
    TTL: {
      set: SetTTL.bind
    },
    BOS: {
      set: SetField
    },
    Tag: {
      push: PushMPLS,
      pop: PopMPLS
    }
  },
  ARP: {
    Opcode: {
      set: SetField
    },
    THA: {
      set: SetField
    },
    TPA: {
      set: SetField
    },
    SHA: {
      set: SetField
    },
    SPA: {
      set: SetField
    }
  },
  IPv4: {
    DSCP: {
      set: SetField
    },
    ECN : {
      set: SetField
    },
    Proto: {
      set: SetField
    },
    Src: {
      set: SetField
    },
    Dst: {
      set: SetField
    },
    TTL: {
      set: SetField,
      dec: DecTTL,
      copy_out: CopyTTLOut,
      copy_in: CopyTTLIn
    }
  },
  IPv6: {
    Src: {
      set: SetField
    },
    Dst: {
      set: SetField
    },
    Flabel: {
      set: SetField
    },
    TTL: {
      set: SetField,
      dec: DecTTL,
      copy_out: CopyTTLOut,
      copy_in: CopyTTLIn
    }
  },
  ICMPv4: {
    Type: {
      set: SetField
    },
    Code: {
      set: SetField
    }
  },
  ICMPv6: {
    Type: {
      set: SetField
    },
    Code: {
      set: SetField
    }
  },
  TCP: {
    Src: {
      set: SetField
    },
    Dst: {
      set: SetField
    }
  },
  UDP: {
    Src: {
      set: SetField
    },
    Dst: {
      set: SetField
    }
  },
  SCTP: {
    Src: {
      set: SetField
    },
    Dst: {
      set: SetField
    }
  },
  ND: {
    Target: {
      set: SetField
    },
    HW: {
      set: SetField
    }
  }
};

function getGeneric(name, store, category, field, action) {
  if(!_(store).has(category)) {
    throw name+' missing: '+category;
  }
  if(!_(store[category]).has(field)) {
    throw name+'['+category+']'+' missing: '+field;
  }
  if(!_(store[category][field]).has(action)) {
    throw name+'['+category+']'+'['+field+']'+' missing: '+action;
  }
  return store[category][field][action];
}

function getTIPS(category, field, action) {
  return getGeneric('TIPS', TIPS, category, field, action);
}

function getTESTS(category, field, action) {
  return getGeneric('TESTS', TESTS, category, field, action);
}

function getType(category, field, action) {
  return getGeneric('Types', Types, category, field, action);
}

function ActionProfile(ap, category, field, action) {
  var that;
  if(_.isObject(ap)) {
    _.extend(this, ap);
  } else {
    this.category = category;
    this.field    = field;
    this.action   = action ? action : '--n/a--';
    this.enabled  = true;
  }
  this.tip  = getTIPS(this.category, this.field, this.action);
  this.test = getTESTS(this.category, this.field, this.action);
  that      = this;
  this.mkType = function() {
    var Type = getType(that.category, that.field, that.action);
    var args = [Type, null, null].concat(Array.prototype.slice.call(arguments));
    var T = _.bind.apply(null, args);
    var t = new T();
    t.category = that.category;
    t.protocol = that.category;
    t.field = that.field;
    t.action = that.action;
    return t;
  };
}

ActionProfile.prototype.clone = function() {
  return new ActionProfile(this);
};

function mkOutputProfile(){
  return new ActionProfile(
    null,
    'Internal',
    'Output'
  );
}

function Output(output, port_id) {
  if(_.isObject(output)) {
    _.extend(this, output);
  } else {
    this.port_id = port_id;
  }
}

Output.prototype.clone = function() {
  return new Output(this);
};

Output.prototype.toString = function() {
  return 'output('+this.port_id+')';
};

Output.prototype.toValue = function() {
  return this.port_id;
};

Output.prototype.step = function(dp, ctx) {
  dp.output(this.port_id, null, ctx);
};

function Group(group, group_id) {
  if(_.isObject(group)) {
    _.extend(this, group);
  } else {
    this.group_id = group_id;
  }
  this.name = 'Group';
}

Group.prototype.clone = function() {
  return new Group(this);
};

Group.prototype.toString = function() {
  return 'group('+this.group_id+')';
};

Group.prototype.step = function(dp, ctx) {
  dp.output(null, this.group_id, ctx);
};

Group.prototype.toValue = function() {
  return this.group_id;
};

function mkGroupProfile() {
  return new ActionProfile(
    null,         // default construction
    'Internal',   // Category of action
    'Group'      // Name of action
  );
}

function Queue(queue, queue_id) {
  if(_.isObject(queue)) {
    _.extend(this, queue);
  } else {
    this.queue_id = queue_id;
  }
  this.name = 'Queue';
}

Queue.prototype.clone = function() {
  return new Queue(this);
};

Queue.prototype.toString = function() {
  return 'queue('+this.queue_id+')';
};

Queue.prototype.toValue = function() {
  return this.queue_id;
};

Queue.prototype.step = function(dp, ctx) {
  ctx.queue_id = this.queue_id;
};

function mkQueueProfile() {
  return new ActionProfile(
    null,         // default construction
    'Internal',   // Category of action
    'Queue'      // Name of action
  );
}

function Pop(pop, tag){
  if(_.isObject(pop)) {
    this.tag = pop.tag;
  } else {
    this.tag = tag;
  }
  this.name = 'Pop';
}

Pop.prototype.clone = function() {
  return new Pop(this);
};

Pop.prototype.toString = function() {
  return this.tag;
};

Pop.prototype.step = function(dp, ctx) {
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(this.tag.name === ctx.packet.protocols[i].name){
      ctx.packet.protocols.splice(i, 1);
      // might need a check on this, seems like there should be boudns check
      ctx.packet.protocols[i-1].setPayload(ctx.packet.protocols[i].name);
    }
  }
};

function PopVLAN() {
  this.tag = VLAN.name;
}

PopVLAN.prototype.clone    = Pop.prototype.clone;
PopVLAN.prototype.toString = Pop.prototype.toString;
PopVLAN.prototype.step     = Pop.prototype.step;

function mkSetVLANIDProfile() {
  return new ActionProfile(
    null,       // default construction
    'VLAN',     // Category of action
    'ID',      // Name of action
    'set'       // Action behavior
  );
}

function mkSetVLANPriorityProfile() {
  return new ActionProfile(
    null,       // default construction
    'VLAN',     // Category of action
    'Priority',      // Name of action
    'set'       // Action behavior
  );
}

function mkPopVLANProfile() {
  return new ActionProfile(
    null,       // default construction
    'VLAN',     // Category of action
    'Tag',      // Name of action
    'pop'       // Action behavior
  );
}

function mkPushVLANProfile() {
  return new ActionProfile(
    null,       // default construction
    'VLAN',     // Category of action
    'Tag',      // Name of action
    'push'       // Action behavior
  );
}

function PopMPLS() {
  this.tag = MPLS.name;
}

PopMPLS.prototype.clone    = Pop.prototype.clone;
PopMPLS.prototype.toString = Pop.prototype.toString;
PopMPLS.prototype.step     = Pop.prototype.step;

function mkSetMPLSLabelProfile() {
  return new ActionProfile(
    null,       // default construction
    'MPLS',     // Category of action
    'Label',      // Name of action
    'set'       // Action behavior
  );
}

function mkSetMPLSTTLProfile() {
  return new ActionProfile(
    null,
    'MPLS',
    'TTL',
    'set'
  );
}

function mkSetMPLSBOSProfile() {
  return new ActionProfile(
    null,
    'MPLS',
    'BOS',
    'set'
  );
}

function mkPopMPLSProfile() {
  return new ActionProfile(
    null,       // default construction
    'MPLS',     // Category of action
    'Tag',      // Name of action
    'pop'       // Action behavior
  );
}

function mkPushMPLSProfile() {
  return new ActionProfile(
    null,       // default construction
    'MPLS',     // Category of action
    'Tag',      // Name of action
    'push'       // Action behavior
  );
}

function mkSetARPOpcodeProfile() {
  return new ActionProfile(
    null,
    'ARP',
    'Opcode',
    'set'
  );
}

function mkSetARPSHAProfile() {
  return new ActionProfile(
    null,
    'ARP',
    'SHA',
    'set'
  );
}

function mkSetARPSPAProfile() {
  return new ActionProfile(
    null,
    'ARP',
    'SPA',
    'set'
  );
}

function mkSetARPTHAProfile() {
  return new ActionProfile(
    null,
    'ARP',
    'THA',
    'set'
  );
}

function mkSetARPTPAProfile() {
  return new ActionProfile(
    null,
    'ARP',
    'TPA',
    'set'
  );
}


function mkSetIPV4DSCPProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'DSCP',
    'set'
  );
}

function mkSetIPV4ECNProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'ECN',
    'set'
  );
}

function mkSetIPV4SrcProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'Src',
    'set'
  );
}

function mkSetIPV4DstProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'Dst',
    'set'
  );
}

function mkIPV4DecTTLProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'TTL',
    'dec'
  );
}

function mkIPV4CopyTTLOutProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'TTL',
    'copy_out'
  );
}

function mkIPV4CopyTTLInProfile() {
  return new ActionProfile(
    null,
    'IPv4',
    'TTL',
    'copy_in'
  );
}

function mkIPV6setSrcProfile() {
  return new ActionProfile(
    null,
    'IPv6',
    'Src',
    'set'
  );
}

function mkIPV6setDstProfile() {
  return new ActionProfile(
    null,
    'IPv6',
    'Dst',
    'set'
  );
}

function mkIPV6setFlabelProfile() {
  return new ActionProfile(
    null,
    'IPv6',
    'Flabel',
    'set'
  );
}

function mkIPV6DecTTLProfile() {
  return new ActionProfile(
    null,
    'IPv6',
    'TTL',
    'dec'
  );
}

function mkIPV6CopyTTLOutProfile() {
  return new ActionProfile(
    null,
    'IPv6',
    'TTL',
    'copy_out'
  );
}

function mkIPV6CopyTTLInProfile() {
  return new ActionProfile(
    null,
    'IPv6',
    'TTL',
    'copy_in'
  );
}

function mkICMPv4setTypeProfile() {
  return new ActionProfile(
    null,
    'ICMPv4',
    'Type',
    'set'
  );
}

function mkICMPv4setCodeProfile() {
  return new ActionProfile(
    null,
    'ICMPv4',
    'Code',
    'set'
  );
}

function mkICMPv6setTypeProfile() {
  return new ActionProfile(
    null,
    'ICMPv6',
    'Type',
    'set'
  );
}

function mkICMPv6setCodeProfile() {
  return new ActionProfile(
    null,
    'ICMPv4',
    'Code',
    'set'
  );
}

function mkTCPsetSrcProfile() {
  return new ActionProfile(
    null,
    'TCP',
    'Src',
    'set'
  );
}

function mkTCPsetDstProfile() {
  return new ActionProfile(
    null,
    'TCP',
    'Dst',
    'set'
  );
}

function mkUDPsetSrcProfile() {
  return new ActionProfile(
    null,
    'UDP',
    'Src',
    'set'
  );
}

function mkUDPsetDstProfile() {
  return new ActionProfile(
    null,
    'UDP',
    'Dst',
    'set'
  );
}

function mkSCTPsetSrcProfile() {
  return new ActionProfile(
    null,
    'SCTP',
    'Src',
    'set'
  );
}

function mkSCTPsetDstProfile() {
  return new ActionProfile(
    null,
    'SCTP',
    'Dst',
    'set'
  );
}

function mkNDsetTargetProfile() {
  return new ActionProfile(
    null,
    'ND',
    'Target',
    'set'
  );
}

function mkNDsetHWProfile() {
  return new ActionProfile(
    null,
    'ND',
    'HW',
    'set'
  );
}



function CopyTTLIn(){
  this.name = 'CopyTTLIn';
}

CopyTTLIn.prototype.clone = function(){
  return new CopyTTLIn();
};

CopyTTLIn.prototype.step = function(dp, ctx){
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(ctx.packet.protocols[i].name === MPLS.name &&
        (ctx.packet.protocols[i+1].name === IPV4.name ||
         ctx.packet.protocols[i+1].name === IPV6.name ||
         ctx.packet.protocols[i+1].name === MPLS.name)){
         ctx.packet.protocols[i+1].ttl(ctx.packet.protocols[i].ttl());
         return;
    }
  }
  throw 'CopyTTLIn(%s, %s) Miss' + ctx.packet.protocols[i].name +
        ctx.packet.protocols[i+1].name;
};

function CopyTTLOut(){
  this.name = 'CopyTTLOut';
}

CopyTTLOut.prototype.clone = function(){
  return new CopyTTLOut();
};

CopyTTLOut.prototype.step = function(dp, ctx){
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(ctx.packet.protocols[i].name === MPLS.name &&
         ctx.packet.protocols[i-1].name === MPLS.name){
         ctx.packet.protocols[i-1].ttl(ctx.packet.protocols[i].ttl());
         return;
    } else if((ctx.packet.protocols[i].name === IPV4.name ||
              ctx.packet.protocols[i].name === IPV6.name) &&
              (ctx.packet.protocols[i-1].name === MPLS.name) ){
                ctx.packet.protocols[i-1].ttl(ctx.packet.protocols[i].ttl());
                return;
              }
  }
  throw 'CopyTTLIn(%s, %s) Miss' + ctx.packet.protocols[i].name +
        ctx.packet.protocols[i+1].name;
};

function SetTTL(st, proto, value){
  if(_.isObject(st)) {
    _.extend(this, st);
    this.value = st.value.clone();
  } else {
    this.protocol = proto;
    this.value = value;
    this.field = '_ttl';
  }
  this.name = 'SetTTL';
}

SetTTL.prototype.clone = function(){
  return new SetTTL(this);
};

SetTTL.prototype.step = function(dp, ctx) {
  var protocol = _.find(ctx.packet.protocols, function(protocol){
    return protocol.name === this.protocol;
  }, this);
  if(protocol) {
    protocol[this.field] = this.value;
  } else {
    console.log('SetTTL(%s, %s) Miss', this.protocol, this.value.toString());
  }
};

function DecTTL(st, proto){
  if(_.isObject(st)) {
    _.extend(this, st);
  } else {
    this.protocol = proto;
    this.field = '_ttl';
  }
  this.name = 'DecTTL';
}

DecTTL.prototype.clone = function() {
  return new DecTTL(this);
};

DecTTL.prototype.step = function(dp, ctx) {
  var protocol = _.find(ctx.packet.protocols, function(protocol){
    return protocol.name === this.protocol;
  }, this);
  if(protocol) {
    protocol.decTTL();
  } else {
    console.log('DecTTL(%s) Miss', this.protocol);
  }
};

function Push(psh, tag) {
  if(_.isObject(psh)) {
    this.tag = psh.tag.clone();
  } else {
    this.tag = tag;
  }
  this.name = 'Push';
}

Push.prototype.clone = function() {
  return new Push(this);
};

Push.prototype.toString = function() {
  return this.tag.toString();
};

Push.prototype.step = function(dp, ctx) {
  if(ctx.packet.protocols.length === 1){
    this.tag.setDefaults(ctx.packet.protocols, 0);
    ctx.packet.protocols.push(this.tag);
    ctx.packet.protocols[0].setPayload(this.tag.name);
  } else {
  for(var i = 0; i < ctx.packet.protocols.length; i++){
    if(this.tag.insertHere(ctx.packet.protocols[i])){
      this.tag.setDefaults(ctx.packet.protocols, i);
      ctx.packet.protocols.splice(i, 0, this.tag);
      ctx.packet.protocols[i-1].setPayload(this.tag.name);
      return;
    }
  }
  throw 'Push failed';
  }

};

function PushVLAN() {
  this.tag = VLAN.name;
}

PushVLAN.prototype.clone    = Push.prototype.clone;
PushVLAN.prototype.toString = Push.prototype.toString;
PushVLAN.prototype.step     = Push.prototype.step;

function PushMPLS() {
  this.tag = MPLS.name;
}

PushMPLS.prototype.clone    = Push.prototype.clone;
PushMPLS.prototype.toString = Push.prototype.toString;
PushMPLS.prototype.step     = Push.prototype.step;

function SetField(sf, value, proto, field) {
  if(_.isObject(sf)) {
    _.extend(this, sf);
    this.value = sf.value.clone();
  } else {
    this.protocol = proto;
    this.field    = field;
    this.value    = value;
  }
  this.name = 'SetField';
}

SetField.prototype.clone = function() {
  return new SetField(this);
};

SetField.prototype.toString = function() {
  return this.protocol+'('+this.field+'='+this.value.toString()+')';
};

SetField.prototype.toValue = function() {
  return this.value;
};

SetField.prototype.step = function(dp, ctx) {
  var protocol = _.find(ctx.packet.protocols, function(protocol) {
    return protocol.name === this.protocol && _(protocol).has(this.field);
  }, this);
  if(protocol) {
    protocol[this.field] = this.value;
  } else {
    console.log('SetField(%s, %s, %s) Miss', this.protocol, this.field,
                this.value.toString());
  }
};

function mkSetEthSrcProfile() {
  return new ActionProfile(
    null,           // default construction
    'Ethernet',     // Category of action
    'Src',          // Name of action
    'set'           // Action behavior
  );
}

function mkSetEthDstProfile() {
  return new ActionProfile(
    null,           // default construction
    'Ethernet',     // Category of action
    'Dst',          // Name of action
    'set'           // Action behavior
  );
}

function Set(set) {
  if(_.isObject(set)) {
    //FIXME: implement
    _.each(set.actions, function(value, key) {
      if(key === 'setField') {
      } else if(key === 'pop_mpls') {
      } else if(key === 'pop_pbb') {
      } else if(key === 'pop_vlan') {
      } else if(key === 'pop_mpls') {
      } else if(key === 'pop_pbb') {
      } else if(key === 'pop_vlan') {
      } else if(key === 'push_vlan'){
      } else {
      }
    }, this);
  } else {
    this.actions = {};
  }
}

Set.prototype.clone = function() {
  return new Set(this);
};

Set.prototype.toView = function() {
  return [{
    name: 'eth',
    value1: 'src=',
    value2: '00:00:00:00:00:00'
  },{
    name: 'eth',
    value1: 'dst=',
    value2: '00:00:00:00:00:00'
  },{
    name: 'queue',
    value1: 5
  },{
    name: 'Output',
    value1: 2
  }];
};

Set.prototype.clear = function() {
  this.actions = {};
};

Set.prototype.get = function() {
  //FIXME: needs implementation
};

Set.prototype.concat = function() {
  //FIXME: needs implementation
};

Set.prototype.copy_ttl_in = function(action) {
  if(action) {
    this.actions.copy_ttl_in = action;
  }
};

Set.prototype.copy_ttl_out = function(action){
  if(action){
    this.actions.copy_ttl_out = action;
  }
};

Set.prototype.pop_mpls = function(action) {
  if(action) {
    if(!_(this.actions).has('pop_mpls')) {
      this.actions.pop_mpls = [];
    }
    this.actions.pop_mpls.push(action);
  }
};

Set.prototype.pop_pbb = function(action) {
  if(action) {
    if(!_(this.actions).has('pop_pbb')) {
      this.actions.pop_pbb = [];
    }
    this.actions.pop_pbb.push(action);
  }
};

Set.prototype.pop_vlan = function(action) {
  if(action) {
    if(!_(this.actions).has('pop_vlan')) {
      this.actions.pop_vlan = [];
    }
    this.actions.pop_vlan.push(action);
  }
};

Set.prototype.push_mpls = function(action) {
  if(action) {
    if(!_(this.actions).has('push_mpls')) {
      this.actions.push_mpls = [];
    }

    this.actions.push_mpls.push(action);
  }
};

Set.prototype.push_pbb = function(action) {
  if(action) {
    if(!_(this.actions).has('push_pbb')) {
      this.actions.push_pbb = [];
    }
    this.actions.push_pbb = action;
  }
};

Set.prototype.push_vlan = function(action) {
  if(action) {
    if(!_(this.actions).has('push_vlan')) {
      this.actions.push_vlan = [];
    }
    this.actions.push_vlan.push(action);
  }
};

Set.prototype.setField = function(action) {
  if(!_(this.actions).has('setField')) {
    this.actions.setField = {};
  }
  if(!_(this.actions.setField).has(action.protocol)) {
    this.actions.setField[action.protocol] = {};
  }
  this.actions.setField[action.protocol][action.field] = action;
};

Set.prototype.setTTL = function(action) {
  if(!_(this.actions).has('setField')) {
    this.actions.setField = {};
  }
  if(!_(this.actions.setField).has(action.protocol)) {
    this.actions.setField[action.protocol] = {};
  }
  this.actions.setField[action.protocol][action.field] = action;
};

Set.prototype.decTTL = function(action) {
  if(action){
    this.actions.dec_ttl = action;
  }
};

Set.prototype.queue = function(action) {
  if(action) {
    this.actions.queue = action;
  }
};

Set.prototype.group = function(action) {
  if(action) {
    this.actions.group = action;
    if(_(this.actions).has('output')) {
      delete this.actions.output;
    }
  }
};

Set.prototype.output = function(action) {
  if(action && !_(this.actions).has('group')) {
    this.actions.output = action;
  }
};

Set.prototype.stepSetField = function(dp, ctx, proto) {
  var key;
  if(_(this.actions.setField).has(proto)) {
    key = _(this.actions.setField[proto]).keys()[0];
    this.actions.setField[proto][key].step(dp, ctx);
    delete this.actions.setField[proto][key];
    if(_(this.actions.setField[proto]).keys().length === 0) {
      delete this.actions.setField[proto];
    }
    if(_(this.actions.setField).keys().length === 0) {
      delete this.actions.setField;
    }
    return true;
  } else {
    return false;
  }
};

Set.prototype.stepArray = function(dp, ctx, name) {
  var state = false;
  if(_(this.actions).has(name)) {

    if(this.actions[name].length > 0) {
      this.actions[name][0].step(dp, ctx);
      this.actions[name].splice(0, 1);
      state = true;
    }

    if(this.actions[name].length === 0) {
      delete this.actions[name];
    }
  }
  return state;
};

Set.prototype.empty = function() {
  return _(this.actions).keys().length === 0;
};

// Execute the action set in a precise ordering
Set.prototype.step = function(dp, ctx) {

  if(this.actions.copy_ttl_in) {
    this.actions.copy_ttl_in.step(dp, ctx);
    delete this.actions.copy_ttl_in;
    return true;
  }

  if(this.stepArray(dp, ctx, 'pop_mpls')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pop_pbb')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'pop_vlan')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'push_mpls')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'push_pbb')) {
    return true;
  } else if(this.stepArray(dp, ctx, 'push_vlan')) {
    return true;
  }

  if(this.actions.copy_ttl_out) {
    this.actions.copy_ttl_out.step(dp, ctx);
    delete this.actions.copy_ttl_out;
    return true;
  }

  if(this.actions.dec_ttl) {
    this.actions.dec_ttl.step(dp, ctx);
    delete this.actions.dec_ttl;
    return true;
  }

  if(_(this.actions).has('setField')) {
    if(_(this.actions.setField).keys().length > 0) {
      if(this.stepSetField(dp, ctx, ETHERNET.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, VLAN.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ARP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, MPLS.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, IPV4.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, IPV6.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ICMPV4.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ICMPV6.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, TCP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, UDP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, SCTP.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ETHERNET.name)) {
        return true;
      } else if(this.stepSetField(dp, ctx, ND.name)){
        return true;
      } else {
        throw 'Bad setField keys: '+this.actions.setField.keys();
      }
    }
  }

  if(this.actions.queue) {
    this.actions.queue.step(dp, ctx);
    delete this.actions.queue;
    return true;
  }

  // Execute group if present or output if present
  if(this.actions.group) {
    this.actions.group.step(dp, ctx);
    delete this.actions.group;
    return true;
  }
  if(this.actions.output) {
    this.actions.output.step(dp, ctx);
    delete this.actions.output;
    return true;
  }
  return false;
};

Set.prototype.execute = function(dp, ctx) {
  while(!this.empty()) {
    this.step(dp, ctx);
  }
};

function List(list) {
  if(_.isObject(list)) {
    this.actions = _.map(list.actions, function(action) {
      //return action.clone();
      switch(action.name){
        case 'Output':
          return new Output(action);
        case 'SetField':
          return new SetField(action);
        case 'Group':
          return new Group(action);
        case 'Queue':
          return new Queue(action);
        case 'Push':
          return new Push(action);
        case 'Pop':
          return new Pop(action);
        case 'SetTTL':
          return new SetTTL(action);
        case 'DecTTL':
          return new DecTTL(action);
        case 'CopyTTLIn':
          return new CopyTTLIn(action);
        case 'CopyTTLOut':
          return new CopyTTLOut(action);
        default:
          break;
      }
      //return new [action.name](action);
    });
  } else {
    this.actions = [];
  }
}

List.prototype.actions = function() {
  return this.actions;
};

List.prototype.clone = function() {
  return new List(this);
};

List.prototype.toView = function() {
  return {
  };
};

List.prototype.push = function(action) {
  this.actions.push(action);
};

List.prototype.pop = function() {
  this.actions.pop();
};

List.prototype.empty = function() {
  return this.actions.length === 0;
};

List.prototype.step = function(dp, ctx) {
  if(this.actions.length === 0) {
    return;
  }
  this.actions[0].step(dp, ctx);
  this.actions.splice(0, 1);
};

List.prototype.execute = function(dp, ctx) {
  while(!this.empty()) {
    this.step(dp, ctx);
  }
};


function Available() {
  return [{
    protocol: 'Internal',
    actions: [
      mkOutputProfile(),
      mkGroupProfile(),
      mkQueueProfile()
    ]
  }, {
    protocol: 'Ethernet',
    actions: [
      mkSetEthSrcProfile(),
      mkSetEthDstProfile(),
    ]
  }, {
    protocol: 'VLAN',
    actions: [
      mkSetVLANIDProfile(),
      mkSetVLANPriorityProfile(),
      mkPushVLANProfile(),
      mkPopVLANProfile()
    ]
  }, {
    protocol: 'MPLS',
    actions: [
      mkSetMPLSLabelProfile(),
      mkSetMPLSTTLProfile(),
      mkSetMPLSBOSProfile(),
      // FIXME there are others ...
      mkPushMPLSProfile(),
      mkPopMPLSProfile()
    ]
  }, {
    protocol: 'ARP',
    actions: [
      mkSetARPOpcodeProfile(),
      mkSetARPSHAProfile(),
      mkSetARPSPAProfile(),
      mkSetARPTHAProfile(),
      mkSetARPTPAProfile()
    ]
  },{
    protocol: 'IPv4',
    actions: [
      mkSetIPV4DSCPProfile(),
      mkSetIPV4ECNProfile(),
      mkSetIPV4SrcProfile(),
      mkSetIPV4DstProfile(),
      mkIPV4DecTTLProfile(),
      mkIPV4CopyTTLOutProfile(),
      mkIPV4CopyTTLInProfile()
    ]
  },{
    protocol: 'IPv6',
    actions: [
      mkIPV6setSrcProfile(),
      mkIPV6setDstProfile(),
      mkIPV6setFlabelProfile(),
      mkIPV6DecTTLProfile(),
      mkIPV6CopyTTLOutProfile(),
      mkIPV6CopyTTLInProfile()
    ]
  },{
    protocol: 'ICMPv4',
    actions: [
      mkICMPv4setTypeProfile(),
      mkICMPv4setCodeProfile()
    ]
  },{
    protocol: 'ICMPv6',
    actions: [
      mkICMPv6setTypeProfile(),
      mkICMPv6setCodeProfile()
    ]
  },{
    protocol: 'TCP',
    actions: [
      mkTCPsetSrcProfile(),
      mkTCPsetDstProfile()
    ]
  },{
    protocol: 'UDP',
    actions: [
      mkUDPsetSrcProfile(),
      mkUDPsetDstProfile()
    ]
  },{
    protocol: 'SCTP',
    actions: [
      mkSCTPsetSrcProfile(),
      mkSCTPsetDstProfile()
    ]
  },{
    protocol: 'ND',
    actions: [
      mkNDsetTargetProfile(),
      mkNDsetHWProfile()
    ]
  }];
}

function cloneAvailable(a) {
  return _(a).map(function(grouping) {
    return {
      protocol: grouping.protocol,
      actions: _(grouping.actions).map(function(action) {
        return _.clone(action);
      })
    };
  });
}

return {
  ActionProfile: ActionProfile,
  Output: Output,
  Group: Group,
  Queue: Queue,
  SetField: SetField,
  Set: Set,
  List: List,
  Push: Push,
  Pop: Pop,
  SetTTL: SetTTL,
  DecTTL: DecTTL,
  CopyTTLIn: CopyTTLIn,
  CopyTTLOut: CopyTTLOut,
  Available: Available,
  cloneAvailable: cloneAvailable,
  //TESTS: TESTS,
  //TIPS: TIPS,
  Types: Types
};

});
