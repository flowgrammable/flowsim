'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.instruction
 * @description
 * # instruction
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Instruction', function(fgConstraints, Action) {


function mkActionField(name, value, key) {
  return {
    name: name,
    value: value,
    key: key
  };
}

var Instruction = {};

function Profile(profile){
  if(_.isObject(profile)) {
    _.extend(this, profile);
    this.caps = _.clone(profile.caps);
    this.apply = _.map(profile.apply, function(i) {
      return {
        protocol: i.protocol,
        fields: _.map(i.fields, function(j) {
          return _.clone(j);
        })
      };
    });
    this.write = _.map(profile.write, function(i){
      return {
        protocol: i.protocol,
        fields: _.map(i.fields, function(j) {
          return _.clone(j);
        })
      };
    });
    this.goto_ = _.map(profile.goto_, function(i) {
      return _.clone(i);
    });
  } else {
    this.caps = {
      apply    : true,
      clear    : true,
      write    : true,
      metadata : true,
      meter    : true,
      goto_    : true
    };
    this.apply = [{
      protocol: 'Internal',
      fields: [
        mkActionField('Output', true, 'forward'),
        mkActionField('Drop', true, 'drop'),
        mkActionField('Set Group', true, 'set_group'),
        mkActionField('Set Queue', true, 'set_queue')
      ]
    }, {
      protocol: 'Ethernet',
        fields: [
          mkActionField('Src write', true, 'set_eth_src'),
          mkActionField('Dst write', true, 'set_eth_dst'),
          mkActionField('Typelen write', true, 'set_eth_type')
        ]
    }, {
    protocol: 'ARP',
      fields: [
        mkActionField('Opcode write', true, 'set_arp_op'),
        mkActionField('SHA write', true, 'set_arp_sha'),
        mkActionField('SPA write', true, 'set_arp_spa'),
        mkActionField('THA write', true, 'set_arp_tha'),
        mkActionField('TPA write', true, 'set_arp_tpa')
      ]
    }, {
      protocol: 'MPLS',
      fields: [
        mkActionField('Label write', true, 'set_mpls_label'),
        mkActionField('TC write', true, 'set_mpls_tc'),
        mkActionField('BOS write', true, 'set_mpls_bos'),
        mkActionField('Set TTL', true, 'set_mpls_ttl'),
        mkActionField('Dec TTL', true, 'dec_mpls_ttl'),
        mkActionField('Push Tag', true, 'push_mpls'),
        mkActionField('Pop Tag', true, 'pop_mpls')
      ]
    }, {
      protocol: 'VLAN',
      fields: [
        mkActionField('PCP write', true, 'set_vlan_pcp'),
        mkActionField('DEI write', true, 'set_vlan_dei'),
        mkActionField('VID write', true, 'set_vlan_vid'),
        mkActionField('Push tag', true, 'push_vlan'),
        mkActionField('Pop tag', true, 'pop_vlan')
      ]
    }, {
      protocol: 'IPv4',
      fields: [
        mkActionField('DSCP write', true, 'set_ip_dscp'),
        mkActionField('ECN write', true, 'set_ip_ecn'),
        mkActionField('Proto write', true, 'set_ip_proto'),
        mkActionField('Src write', true, 'set_ipv4_src'),
        mkActionField('Dst write', true, 'set_ipv4_dst'),
        mkActionField('Set TTL', true, 'set_nw_ttl'),
        mkActionField('Dec TTL', true, 'dec_nw_ttl')
      ]
    }, {
      protocol: 'IPv6',
      fields: [
        mkActionField('Src write', true, 'set_ipv6_src'),
        mkActionField('Dst write', true, 'set_ipv6_dst'),
        mkActionField('FLabel write', true, 'set_ipv6_flabel')
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
        mkActionField('Type write', true, 'set_icmpv4_type'),
        mkActionField('Code write', true, 'set_icmpv4_code')
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
        mkActionField('Type write', true, 'set_icmpv6_type'),
        mkActionField('Code write', true, 'set_icmpv6_code')
      ]
    }, {
      protocol: 'TCP',
      fields: [
        mkActionField('Src write', true, 'set_tcp_src'),
        mkActionField('Dst write', true, 'set_tcp_dst')
      ]
    }, {
      protocol: 'UDP',
      fields: [
        mkActionField('Src write', true, 'set_udp_src'),
        mkActionField('Dst write', true, 'set_udp_dst')
      ]
    }, {
      protocol: 'SCTP',
      fields: [
        mkActionField('Src write', true, 'set_sctp_src'),
        mkActionField('Dst write', true, 'set_sctp_dst')
      ]
    }];
    this.write = [{
      protocol: 'Internal',
      fields: [
        mkActionField('Output', true, 'forward'),
        mkActionField('Drop', true, 'drop'),
        mkActionField('Set Group', true, 'set_group'),
        mkActionField('Set Queue', true, 'set_queue')
      ]
    }, {
      protocol: 'Ethernet',
        fields: [
          mkActionField('Src write', true, 'set_eth_src'),
          mkActionField('Dst write', true, 'set_eth_dst'),
          mkActionField('Typelen write', true, 'set_eth_type')
        ]
    }, {
    protocol: 'ARP',
      fields: [
        mkActionField('Opcode write', true, 'set_arp_op'),
        mkActionField('SHA write', true, 'set_arp_sha'),
        mkActionField('SPA write', true, 'set_arp_spa'),
        mkActionField('THA write', true, 'set_arp_tha'),
        mkActionField('TPA write', true, 'set_arp_tpa')
      ]
    }, {
      protocol: 'MPLS',
      fields: [
        mkActionField('Label write', true, 'set_mpls_label'),
        mkActionField('TC write', true, 'set_mpls_tc'),
        mkActionField('BOS write', true, 'set_mpls_bos'),
        mkActionField('Set TTL', true, 'set_mpls_ttl'),
        mkActionField('Dec TTL', true, 'dec_mpls_ttl'),
        mkActionField('Push Tag', true, 'push_mpls'),
        mkActionField('Pop Tag', true, 'pop_mpls')
      ]
    }, {
      protocol: 'VLAN',
      fields: [
        mkActionField('PCP write', true, 'set_vlan_pcp'),
        mkActionField('DEI write', true, 'set_vlan_dei'),
        mkActionField('VID write', true, 'set_vlan_vid'),
        mkActionField('Push tag', true, 'push_vlan'),
        mkActionField('Pop tag', true, 'pop_vlan')
      ]
    }, {
      protocol: 'IPv4',
      fields: [
        mkActionField('DSCP write', true, 'set_ip_dscp'),
        mkActionField('ECN write', true, 'set_ip_ecn'),
        mkActionField('Proto write', true, 'set_ip_proto'),
        mkActionField('Src write', true, 'set_ipv4_src'),
        mkActionField('Dst write', true, 'set_ipv4_dst'),
        mkActionField('Set TTL', true, 'set_nw_ttl'),
        mkActionField('Dec TTL', true, 'dec_nw_ttl')
      ]
    }, {
      protocol: 'IPv6',
      fields: [
        mkActionField('Src write', true, 'set_ipv6_src'),
        mkActionField('Dst write', true, 'set_ipv6_dst'),
        mkActionField('FLabel write', true, 'set_ipv6_flabel')
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
        mkActionField('Type write', true, 'set_icmpv4_type'),
        mkActionField('Code write', true, 'set_icmpv4_code')
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
        mkActionField('Type write', true, 'set_icmpv6_type'),
        mkActionField('Code write', true, 'set_icmpv6_code')
      ]
    }, {
      protocol: 'TCP',
      fields: [
        mkActionField('Src write', true, 'set_tcp_src'),
        mkActionField('Dst write', true, 'set_tcp_dst')
      ]
    }, {
      protocol: 'UDP',
      fields: [
        mkActionField('Src write', true, 'set_udp_src'),
        mkActionField('Dst write', true, 'set_udp_dst')
      ]
    }, {
      protocol: 'SCTP',
      fields: [
        mkActionField('Src write', true, 'set_sctp_src'),
        mkActionField('Dst write', true, 'set_sctp_dst')
      ]
    }];
    this.metadata = '0xffffffffffffffff';
    this.goto_ = [];
  }
}

Profile.TIPS = {
  apply: 'Applies actions immediately',
  clear: 'Clears the action set',
  write: 'Appends actions to the action set',
  metadata: 'Writes metadata register',
  meter: 'Sends packet to designated meter',
  goto_: 'Jumps to another flow table'
};

Profile.TESTS = {
  metadata: fgConstraints.isUInt(0, 0xffffffffffffffff),
  goto_: function(input) {
    return /^([0-9]+)(\.\.([0-9]+))?$/.test(input);
  }
};

Profile.Miss = Profile;

function Apply(apply, actions) {
  if(_.isObject(apply)) {
    this.actions = apply.actions.clone();
  } else {
    this.actions = actions;
  }
}

Apply.prototype.clone = function() {
  return new Apply(this);
};

Apply.prototype.step = function(dp, ctx) {
  if(this.actions.empty()) {
    return;
  }
  return this.actions.step(dp, ctx);
};

Apply.prototype.empty = function() {
  return this.actions.empty();
};

Apply.prototype.execute = function(dp, ctx) {
  while(!this.actions.empty()) {
    this.actions.step(dp, ctx);
  }
};

function Clear() {}

Clear.prototype.clone = function() { return new Clear(); };

Clear.prototype.step = function(dp, ctx) {
  ctx.actionSet.clear();
};

Clear.prototype.execute = Clear.prototype.step;

function Write(write, actions) {
  if(_.isObject(write)) {
    this.actions = write.actions.clone();
  } else {
    this.actions = actions;
  }
}

Write.prototype.clone = function() {
  return new Write(this);
};

Write.prototype.step = function(dp, ctx) {
  if(this.actions.empty()) {
    return;
  }
  ctx.actionSet.push(this.actions.get());
};

Write.prototype.execute = function(dp, ctx) {
  ctx.actionSet.concat(this.actions);
};

Write.prototype.empty = function(){
  return this.actions.empty();
};

function Metadata(meta, data, mask) {
  if(_.isObject(meta)) {
    this._data = meta._data.clone();
    this._mask = meta._mask.clone();
  } else {
    this._data = data.clone();
    this._mask = mask.clone();
  }
}

Metadata.prototype.clone = function() {
  return new Metadata(this);
};

Metadata.prototype.step = function(dp, ctx) {
  ctx.key.metadata.mask(this.data, this.mask);
};

Metadata.prototype.execute = Metadata.prototype.step;

function Meter(meter, meter_id) {
  if(_.isObject(meter)) {
    this.meter = new Meter(meter);
  } else {
    this.meter_id = meter_id;
  }
}

Meter.prototype.clone = function() {
  return new Meter(this);
};

Meter.prototype.step = function(dp, ctx) {
  ctx.meter = this.meter;
};

Meter.prototype.execute = Meter.prototype.step;

function Goto(jump, table) {
  if(_.isObject(jump)) {
    this.table = jump.table;
  } else {
    this.table = table;
  }
}

Goto.prototype.clone = function() {
  return new Goto(this);
};

Goto.prototype.step = function(dp, ctx) {
  ctx.table(this.table);
};

Goto.prototype.execute = Goto.prototype.step;

function Set(set) {
  if(set) {
    this._meter    = set._meter ? new Meter(set._meter) : null;
    this._apply    = new Apply(set._apply);
    this._clear    = set._clear ? new Clear(set._clear) : null;
    this._write    = new Write(set._write);
    this._metadata = set._metadata ? new Metadata(set._metadata) : null;
    this._goto     = set._goto ? new Goto(set._goto) : null;
  } else {
    this._apply = new Action.List();
    this._write = new Action.Set();
  }
}

Set.prototype.clone = function() {
  return new Set(this);
};

Set.prototype.toView = function() {
  return [{
    name: 'Meter',
      value1: 1234
  }, {
    name: 'Apply',
    set: [{
      name: 'eth',
      value1: 'src=',
      value2: '01:00:00:00:00:00'
    }, {
      name: 'vlan',
      value1: 'vid=',
      value2: '2'
    }, {
      name: 'Output',
      value1: 1
    }]
  },{
    name: 'Clear'
  },{
    name: 'Write',
    set: [{
      name: 'group',
      value1: 2
    }]
  },{
    name: 'Metadata',
    value1: '00:11:22:44:55:66:77,',
    value2: '00:ff:ff:00:00:ff:ff'
  },{
    name: 'Goto',
    value1: 5
  }];
};

Set.prototype.apply = function(apply) {
  if(apply) {
    this._apply = new Apply(null, apply);
  }
};

Set.prototype.write = function(write) {
  if(write) {
    this._write = new Write(null, write);
  }
};

Set.prototype.metadata = function(metadata) {
  if(metadata) {
    this._metadata = new Metadata(null, metadata);
  }
};

Set.prototype.meter = function(meter) {
  if(meter) {
    this._meter = new Meter(null, meter);
  }
};

Set.prototype.jump = function(jump) {
  if(jump) {
    this._goto = new Goto(null, jump);
  }
};

Set.prototype.summarize = function() {
  var result = [];
  if(this._meter) {
    result.push('meter');
  }
  if(!this._apply.empty()) {
    result.push('apply');
  }
  if(this._clear) {
    result.push('clear');
  }
  if(!this._write.empty()) {
    result.push('write');
  }
  if(this._metadata) {
    result.push('metadata');
  }
  if(this._goto) {
    result.push('goto');
  }
  return result.join(', ');
};

Set.prototype.step = function(dp, ctx) {
  if(this._meter && this._meter.step(dp, ctx)) {
    delete this._meter;
    return true;
  }
  if(!this._apply.empty() && this._apply.step(dp, ctx)) {
    return true;
  }
  if(this._clear) {
    this._clear.step(dp, ctx);
    delete this._clear;
    return true;
  }
  if(!this._write.empty() && this._write.step(dp, ctx)) {
    return true;
  }
  if(this._metadata) {
    this._metadata.step(dp, ctx);
    delete this._metadata;
    return true;
  }
  if(this._goto) {
    this._goto.step(dp, ctx);
    delete this._goto;
    return true;
  }
  return false;
};

Set.prototype.empty = function() {
  return this._meter || this._clear || this._write || this._metadata || 
         this._goto;
};

Set.prototype.execute = function(dp, ctx) {
  while(this.step(dp, ctx)) {}
};

return {
  Apply: Apply,
  Write: Write,
  Metadata: Metadata,
  Meter: Meter,
  Goto: Goto,
  Set: Set,
  Instruction: Instruction,
  Profile: Profile
};

});
