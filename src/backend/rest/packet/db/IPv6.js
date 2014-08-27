var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:           { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ethernet_id:  { type: Seq.INTEGER, allowNull: true, references: "ethernet" },
    VLAN_id:      { type: Seq.INTEGER, allowNull: true, references: "vlan" },
    MPLS_id:      { type: Seq.INTEGER, allowNull: true, references: "mpls" },
    ipv6_dscp:       { type: Seq.BLOB, allowNull: false }
    ipv6_ecn:      { type: Seq.BLOB, allowNull: false }
    ipv6_proto:      { type: Seq.BLOB, allowNull: false }
    ipv6_src:      { type: Seq.BLOB, allowNull: false }
    ipv6_dst:      { type: Seq.BLOB, allowNull: false }
    ipv6_flabel:      { type: Seq.BLOB, allowNull: false }
    ipv6_exthdr:      { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ethernet", options: { as: "Ethernet" } }
    belongsTo: { relative: "vlan", options: { as: "VLAN" } }
    belongsTo: { relative: "mpls", options: { as: "MPLS" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'IPv6'
	} 
}
