var orm = require('../../../dbbs'),
    Seq = orm.Seq();

module.exports = {
  model:{
    id:               { type: Seq.INTEGER, allowNull: false, primaryKey: true },  
    ipv6_id:          { type: Seq.INTEGER, allowNull: false, references: "ipv6" },
    icmpv6_type:      { type: Seq.BLOB, allowNull: false }
    icmpv6_code:      { type: Seq.BLOB, allowNull: false }
    icmpv6_nd_target: { type: Seq.BLOB, allowNull: false }
    icmpv6_nd_sll:    { type: Seq.BLOB, allowNull: false }
    icmpv6_nd_sll:    { type: Seq.BLOB, allowNull: false }
  },
  relations:{
    belongsTo: { relative: "ipv6", options: { as: "IPv6" } }
  },
	options:{
		timestamps: false,
		underscored: true,
		tableName: 'ICMPv6'
	} 
}
