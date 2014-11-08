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

Instruction.Profile = function(ins, instruction){
  if(ins instanceof Instruction.Profile || (typeof ins === 'object' && ins !== null)){
    _.extend(this, ins);
    this.caps = _.clone(ins.caps);
    this.apply = _.map(ins.apply, function(i) {
      return {
        protocol: i.protocol,
        fields: _.map(i.fields, function(j) {
          return _.clone(j);
        })
      };
    });
    this.write = _.map(ins.write, function(i){
      return {
        protocol: i.protocol,
        fields: _.map(i.fields, function(j) {
          return _.clone(j);
        })
      };
    });
    this.goto_ = _.map(ins.goto_, function(i) {
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

Instruction.Profile.TIPS = {
  apply: 'Applies actions immediately',
  clear: 'Clears the action set',
  write: 'Appends actions to the action set',
  metadata: 'Writes metadata register',
  meter: 'Sends packet to designated meter',
  goto_: 'Jumps to another flow table'
};

Instruction.Profile.TESTS = {
  metadata: fgConstraints.isUInt(0, 0xffffffffffffffff),
  goto_: function(input) {
    return /^([0-9]+)(\.\.([0-9]+))?$/.test(input);
  }
}

Instruction.Profile.Miss = Instruction.Profile;

function Apply(actions) {
  this.actions = actions;
}

Apply.prototype.execute = function(dp, ctx) {
  _.each(this.actions, function(action) {
    action.execute(dp, ctx);
  });
};

function Clear() {}

Clear.prototype.execute = function(dp, ctx) {
  ctx.actionSet.clear();
};

function Write(actions) {
  this.actions = actions;
}

Write.prototype.execute = function(dp, ctx) {
  ctx.actionSet.concat(this.actions);
};

function Metadata(metadata) {
  this._metadata = metadata;
}

Metadata.prototype.value = function(metadata) {
  if(metadata) {
    this._metadata = new Metadata(metadata);
  } else {
    return this._metadata;
  }
};

Metadata.prototype.execute = function(dp, ctx) {
  ctx.metadata(this._metadata);
};

function Meter(meter_id) {
  this.meter_id = meter_id;
}

Meter.prototype.value = function(meter_id) {
  if(meter_id) {
    this.meter_id = meter_id;
  } else {
    return this.meter_id;
  }
};

Meter.prototype.execute = function(dp, ctx) {
  // meter the flow
};

function Goto(table_id) {
  this.table_id = table_id;
}

Goto.prototype.value = function(table_id) {
  if(table_id) {
    this.table_id = table_id;
  } else {
    return this.table_id;
  }
};

Goto.prototype.execute = function(dp, ctx) {
  ctx.table_id = this.table_id;
};

function Set() {
  this._apply = Action.List();
  this._write = Action.Set();
}

Set.prototype.apply = function(apply) {
  if(apply) {
    this._apply = new Apply(apply);
  } else {
    return this._apply;
  }
};

Set.prototype.write = function(write) {
  if(write) {
    this._write = new Write(write);
  } else {
    return this._write;
  }
};

Set.prototype.metadata = function(metadata) {
  if(metadata) {
    this._metadata = new Metadata(metadata);
  } else {
    return this._metadata;
  }
};

Set.prototype.meter = function(meter) {
  if(meter) {
    this._meter = new Meter(meter);
  } else {
    return this._meter;
  }
};

Set.prototype.jump = function(jump) {
  if(jump) {
    this._jump = new Goto(jump);
  } else {
    return this._jump;
  }
};

Set.prototype.execute = function(dp, ctx) {
  if(this.meter) {
    this.meter.execute(dp, ctx);
  }
  this.apply.execute(dp, ctx);
  if(this.ins.clear) {
    ctx.actionSet.clear();
  }
  this.write.execute(dp, ctx);
  if(this.metadata) {
    this.metadata.execute(dp, ctx);
  }
  if(this.jump) {
    this.jump.execute(dp, ctx);
  }
};

return {
  Apply: Apply,
  Write: Write,
  Metadata: Metadata,
  Meter: Meter,
  Goto: Goto,
  Set: Set,
  Instruction: Instruction,
  Profile: Instruction.Profile
};

});
